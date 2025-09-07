import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { ReservationStatus } from "@prisma/client";
import { sendReservationConfirmation, sendReservationCancellation } from "~/lib/email";

export const reservationRouter = createTRPCRouter({
  // Get user's reservations
  getMyReservations: protectedProcedure
    .input(
      z.object({
        status: z.nativeEnum(ReservationStatus).optional(),
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { status, limit, cursor } = input;

      const reservations = await ctx.db.reservation.findMany({
        where: {
          userId: ctx.session.user.id,
          ...(status && { status }),
        },
        include: {
          barbershop: {
            select: {
              id: true,
              name: true,
              address: true,
              city: true,
              phone: true,
              imageUrl: true,
            },
          },
          service: {
            select: {
              id: true,
              name: true,
              duration: true,
              price: true,
            },
          },
        },
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { date: "desc" },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (reservations.length > limit) {
        const nextItem = reservations.pop();
        nextCursor = nextItem?.id;
      }

      return {
        reservations,
        nextCursor,
      };
    }),

  // Get available time slots for a barbershop and service
  getAvailableSlots: publicProcedure
    .input(
      z.object({
        barbershopId: z.string(),
        serviceId: z.string(),
        date: z.string(), // ISO date string
      })
    )
    .query(async ({ ctx, input }) => {
      const { barbershopId, serviceId, date } = input;
      const selectedDate = new Date(date);

      // Get service details
      const service = await ctx.db.service.findUnique({
        where: { id: serviceId },
        include: { barbershop: true },
      });

      if (!service) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Service not found",
        });
      }

      // Get working hours for the day
      const dayOfWeek = selectedDate.getDay();
      const workingHours = await ctx.db.workingHours.findUnique({
        where: {
          barbershopId_dayOfWeek: {
            barbershopId,
            dayOfWeek,
          },
        },
      });

      if (!workingHours || workingHours.isClosed) {
        return { slots: [] };
      }

      // Get existing reservations for the day
      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 59, 59, 999);

      const existingReservations = await ctx.db.reservation.findMany({
        where: {
          barbershopId,
          date: {
            gte: startOfDay,
            lte: endOfDay,
          },
          status: {
            in: [ReservationStatus.PENDING, ReservationStatus.CONFIRMED],
          },
        },
        select: { date: true },
      });

      // Generate available time slots
      const slots = [];
      const [openHour, openMinute] = workingHours.openTime.split(":").map(Number);
      const [closeHour, closeMinute] = workingHours.closeTime.split(":").map(Number);

      const openTime = new Date(selectedDate);
      openTime.setHours(openHour || 0, openMinute || 0, 0, 0);

      const closeTime = new Date(selectedDate);
      closeTime.setHours(closeHour || 0, closeMinute || 0, 0, 0);

      const slotDuration = 30; // 30 minutes slots
      const serviceDuration = service.duration;

      for (
        let time = new Date(openTime);
        time <= new Date(closeTime.getTime() - serviceDuration * 60000);
        time.setMinutes(time.getMinutes() + slotDuration)
      ) {
        const slotEnd = new Date(time.getTime() + serviceDuration * 60000);
        
        // Check if this slot conflicts with existing reservations
        const hasConflict = existingReservations.some((reservation) => {
          const resStart = new Date(reservation.date);
          const resEnd = new Date(resStart.getTime() + serviceDuration * 60000);
          
          return (
            (time >= resStart && time < resEnd) ||
            (slotEnd > resStart && slotEnd <= resEnd) ||
            (time <= resStart && slotEnd >= resEnd)
          );
        });

        if (!hasConflict) {
          slots.push({
            time: time.toISOString(),
            available: true,
          });
        }
      }

      return { slots };
    }),

  // Create a new reservation
  create: protectedProcedure
    .input(
      z.object({
        barbershopId: z.string(),
        serviceId: z.string(),
        date: z.string(), // ISO date string
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { barbershopId, serviceId, date, notes } = input;
      const reservationDate = new Date(date);

      // Verify service exists and get price
      const service = await ctx.db.service.findUnique({
        where: { id: serviceId },
        include: { barbershop: true },
      });

      if (!service) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Service not found",
        });
      }

      if (service.barbershopId !== barbershopId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Service does not belong to the specified barbershop",
        });
      }

      // Check if the time slot is still available
      const dayOfWeek = reservationDate.getDay();
      const workingHours = await ctx.db.workingHours.findUnique({
        where: {
          barbershopId_dayOfWeek: {
            barbershopId,
            dayOfWeek,
          },
        },
      });

      if (!workingHours || workingHours.isClosed) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Barbershop is closed on this day",
        });
      }

      // Check for conflicts
      const serviceEndTime = new Date(reservationDate.getTime() + service.duration * 60000);
      const conflictingReservation = await ctx.db.reservation.findFirst({
        where: {
          barbershopId,
          date: {
            gte: reservationDate,
            lt: serviceEndTime,
          },
          status: {
            in: [ReservationStatus.PENDING, ReservationStatus.CONFIRMED],
          },
        },
      });

      if (conflictingReservation) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "This time slot is no longer available",
        });
      }

      // Create the reservation
      const reservation = await ctx.db.reservation.create({
        data: {
          userId: ctx.session.user.id,
          barbershopId,
          serviceId,
          date: reservationDate,
          notes,
          totalPrice: service.price,
          status: ReservationStatus.PENDING,
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
          barbershop: {
            select: {
              id: true,
              name: true,
              address: true,
              city: true,
              phone: true,
              email: true,
            },
          },
          service: {
            select: {
              id: true,
              name: true,
              duration: true,
              price: true,
            },
          },
        },
      });

      // Send confirmation email
      if (reservation.user.email) {
        try {
          await sendReservationConfirmation({
            customerName: reservation.user.name || "Client",
            customerEmail: reservation.user.email,
            barbershopName: reservation.barbershop.name,
            barbershopAddress: `${reservation.barbershop.address}, ${reservation.barbershop.city}`,
            barbershopPhone: reservation.barbershop.phone || "",
            serviceName: reservation.service.name,
            servicePrice: reservation.service.price,
            appointmentDate: reservationDate.toLocaleDateString("fr-FR"),
            appointmentTime: reservationDate.toLocaleTimeString("fr-FR", { 
              hour: "2-digit", 
              minute: "2-digit" 
            }),
            notes: reservation.notes || undefined,
          });
        } catch (error) {
          console.error("Failed to send confirmation email:", error);
          // Don't fail the reservation if email fails
        }
      }

      return reservation;
    }),

  // Update reservation status
  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.nativeEnum(ReservationStatus),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, status } = input;

      // Check if user owns the reservation
      const existingReservation = await ctx.db.reservation.findUnique({
        where: { id },
        select: { userId: true },
      });

      if (!existingReservation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Reservation not found",
        });
      }

      if (existingReservation.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only update your own reservations",
        });
      }

      const reservation = await ctx.db.reservation.update({
        where: { id },
        data: { status },
        include: {
          barbershop: {
            select: {
              id: true,
              name: true,
              address: true,
              city: true,
              phone: true,
            },
          },
          service: {
            select: {
              id: true,
              name: true,
              duration: true,
              price: true,
            },
          },
        },
      });

      return reservation;
    }),

  // Cancel a reservation
  cancel: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      // Check if user owns the reservation
      const existingReservation = await ctx.db.reservation.findUnique({
        where: { id },
        select: { userId: true, status: true, date: true },
      });

      if (!existingReservation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Reservation not found",
        });
      }

      if (existingReservation.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only cancel your own reservations",
        });
      }

      // Check if reservation can be cancelled
      if (existingReservation.status === ReservationStatus.CANCELLED) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Reservation is already cancelled",
        });
      }

      if (existingReservation.status === ReservationStatus.COMPLETED) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot cancel a completed reservation",
        });
      }

      // Check if it's too late to cancel (e.g., less than 2 hours before)
      const now = new Date();
      const reservationTime = new Date(existingReservation.date);
      const hoursUntilReservation = (reservationTime.getTime() - now.getTime()) / (1000 * 60 * 60);

      if (hoursUntilReservation < 2) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot cancel reservation less than 2 hours before the appointment",
        });
      }

      const reservation = await ctx.db.reservation.update({
        where: { id },
        data: { status: ReservationStatus.CANCELLED },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
          barbershop: {
            select: {
              id: true,
              name: true,
              address: true,
              city: true,
              phone: true,
            },
          },
          service: {
            select: {
              id: true,
              name: true,
              duration: true,
              price: true,
            },
          },
        },
      });

      // Send cancellation email
      if (reservation.user.email) {
        try {
          await sendReservationCancellation({
            customerName: reservation.user.name || "Client",
            customerEmail: reservation.user.email,
            barbershopName: reservation.barbershop.name,
            barbershopAddress: `${reservation.barbershop.address}, ${reservation.barbershop.city}`,
            barbershopPhone: reservation.barbershop.phone || "",
            serviceName: reservation.service.name,
            servicePrice: reservation.service.price,
            appointmentDate: reservation.date.toLocaleDateString("fr-FR"),
            appointmentTime: reservation.date.toLocaleTimeString("fr-FR", { 
              hour: "2-digit", 
              minute: "2-digit" 
            }),
            notes: reservation.notes || undefined,
          });
        } catch (error) {
          console.error("Failed to send cancellation email:", error);
          // Don't fail the cancellation if email fails
        }
      }

      return reservation;
    }),
});
