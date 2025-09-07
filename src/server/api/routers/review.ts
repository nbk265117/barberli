import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const reviewRouter = createTRPCRouter({
  // Get reviews for a barbershop
  getByBarbershop: publicProcedure
    .input(
      z.object({
        barbershopId: z.string(),
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { barbershopId, limit, cursor } = input;

      const reviews = await ctx.db.review.findMany({
        where: { barbershopId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { createdAt: "desc" },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (reviews.length > limit) {
        const nextItem = reviews.pop();
        nextCursor = nextItem?.id;
      }

      return {
        reviews,
        nextCursor,
      };
    }),

  // Get user's review for a barbershop
  getMyReview: protectedProcedure
    .input(z.object({ barbershopId: z.string() }))
    .query(async ({ ctx, input }) => {
      const review = await ctx.db.review.findUnique({
        where: {
          userId_barbershopId: {
            userId: ctx.session.user.id,
            barbershopId: input.barbershopId,
          },
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });

      return review;
    }),

  // Create or update a review
  upsert: protectedProcedure
    .input(
      z.object({
        barbershopId: z.string(),
        rating: z.number().min(1).max(5),
        comment: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { barbershopId, rating, comment } = input;

      // Check if user has a completed reservation for this barbershop
      const hasReservation = await ctx.db.reservation.findFirst({
        where: {
          userId: ctx.session.user.id,
          barbershopId,
          status: "COMPLETED",
        },
      });

      if (!hasReservation) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only review barbershops where you have completed a service",
        });
      }

      // Create or update the review
      const review = await ctx.db.review.upsert({
        where: {
          userId_barbershopId: {
            userId: ctx.session.user.id,
            barbershopId,
          },
        },
        update: {
          rating,
          comment,
        },
        create: {
          userId: ctx.session.user.id,
          barbershopId,
          rating,
          comment,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });

      // Update barbershop rating and review count
      const allReviews = await ctx.db.review.findMany({
        where: { barbershopId },
        select: { rating: true },
      });

      const averageRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
      const reviewCount = allReviews.length;

      await ctx.db.barbershop.update({
        where: { id: barbershopId },
        data: {
          rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
          reviewCount,
        },
      });

      return review;
    }),

  // Delete a review
  delete: protectedProcedure
    .input(z.object({ barbershopId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { barbershopId } = input;

      // Check if review exists and belongs to user
      const existingReview = await ctx.db.review.findUnique({
        where: {
          userId_barbershopId: {
            userId: ctx.session.user.id,
            barbershopId,
          },
        },
      });

      if (!existingReview) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Review not found",
        });
      }

      // Delete the review
      await ctx.db.review.delete({
        where: {
          userId_barbershopId: {
            userId: ctx.session.user.id,
            barbershopId,
          },
        },
      });

      // Update barbershop rating and review count
      const remainingReviews = await ctx.db.review.findMany({
        where: { barbershopId },
        select: { rating: true },
      });

      if (remainingReviews.length === 0) {
        await ctx.db.barbershop.update({
          where: { id: barbershopId },
          data: {
            rating: 0,
            reviewCount: 0,
          },
        });
      } else {
        const averageRating = remainingReviews.reduce((sum, r) => sum + r.rating, 0) / remainingReviews.length;
        const reviewCount = remainingReviews.length;

        await ctx.db.barbershop.update({
          where: { id: barbershopId },
          data: {
            rating: Math.round(averageRating * 10) / 10,
            reviewCount,
          },
        });
      }

      return { success: true };
    }),
});
