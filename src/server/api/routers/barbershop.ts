import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const barbershopRouter = createTRPCRouter({
  // Get all barbershops
  getAll: publicProcedure
    .input(
      z.object({
        city: z.string().optional(),
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor, city } = input;
      
      const barbershops = await ctx.db.barbershop.findMany({
        where: {
          isActive: true,
          ...(city && { city: { contains: city, mode: "insensitive" } }),
        },
        include: {
          services: {
            where: { isActive: true },
          },
          reviews: true,
          workingHours: true,
        },
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { rating: "desc" },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (barbershops.length > limit) {
        const nextItem = barbershops.pop();
        nextCursor = nextItem?.id;
      }

      return {
        barbershops,
        nextCursor,
      };
    }),

  // Get barbershop by ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const barbershop = await ctx.db.barbershop.findUnique({
        where: { id: input.id },
        include: {
          services: {
            where: { isActive: true },
          },
          reviews: {
            include: {
              user: {
                select: { name: true, image: true },
              },
            },
            orderBy: { createdAt: "desc" },
          },
          workingHours: {
            orderBy: { dayOfWeek: "asc" },
          },
        },
      });

      if (!barbershop) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Barbershop not found",
        });
      }

      return barbershop;
    }),

  // Search barbershops
  search: publicProcedure
    .input(
      z.object({
        query: z.string().min(1),
        city: z.string().optional(),
        limit: z.number().min(1).max(50).default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      const { query, city, limit } = input;

      const barbershops = await ctx.db.barbershop.findMany({
        where: {
          isActive: true,
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
            { address: { contains: query, mode: "insensitive" } },
          ],
          ...(city && { city: { contains: city, mode: "insensitive" } }),
        },
        include: {
          services: {
            where: { isActive: true },
          },
          reviews: true,
        },
        take: limit,
        orderBy: { rating: "desc" },
      });

      return barbershops;
    }),

  // Get nearby barbershops
  getNearby: publicProcedure
    .input(
      z.object({
        latitude: z.number(),
        longitude: z.number(),
        radius: z.number().default(10), // km
        limit: z.number().min(1).max(50).default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      const { latitude, longitude, radius, limit } = input;

      // Using a simple bounding box approach for now
      // In production, you might want to use PostGIS for more accurate distance calculations
      const latRange = radius / 111; // Approximate km per degree latitude
      const lngRange = radius / (111 * Math.cos(latitude * Math.PI / 180));

      const barbershops = await ctx.db.barbershop.findMany({
        where: {
          isActive: true,
          latitude: {
            gte: latitude - latRange,
            lte: latitude + latRange,
          },
          longitude: {
            gte: longitude - lngRange,
            lte: longitude + lngRange,
          },
        },
        include: {
          services: {
            where: { isActive: true },
          },
          reviews: true,
        },
        take: limit,
        orderBy: { rating: "desc" },
      });

      return barbershops;
    }),

  // Create barbershop (admin only)
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        address: z.string().min(1),
        city: z.string().min(1),
        postalCode: z.string().optional(),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
        phone: z.string().optional(),
        email: z.string().email().optional(),
        website: z.string().url().optional(),
        imageUrl: z.string().url().optional(),
        services: z.array(
          z.object({
            name: z.string().min(1),
            description: z.string().optional(),
            duration: z.number().min(1),
            price: z.number().min(0),
          })
        ).optional(),
        workingHours: z.array(
          z.object({
            dayOfWeek: z.number().min(0).max(6),
            openTime: z.string(),
            closeTime: z.string(),
            isClosed: z.boolean().default(false),
          })
        ).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { services, workingHours, ...barbershopData } = input;

      const barbershop = await ctx.db.barbershop.create({
        data: {
          ...barbershopData,
          services: services ? {
            create: services,
          } : undefined,
          workingHours: workingHours ? {
            create: workingHours,
          } : undefined,
        },
        include: {
          services: true,
          workingHours: true,
        },
      });

      return barbershop;
    }),

  // Update barbershop (admin only)
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        description: z.string().optional(),
        address: z.string().min(1).optional(),
        city: z.string().min(1).optional(),
        postalCode: z.string().optional(),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
        phone: z.string().optional(),
        email: z.string().email().optional(),
        website: z.string().url().optional(),
        imageUrl: z.string().url().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      const barbershop = await ctx.db.barbershop.update({
        where: { id },
        data: updateData,
        include: {
          services: true,
          workingHours: true,
        },
      });

      return barbershop;
    }),
});
