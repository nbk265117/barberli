import { barbershopRouter } from "~/server/api/routers/barbershop";
import { reservationRouter } from "~/server/api/routers/reservation";
import { reviewRouter } from "~/server/api/routers/review";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  barbershop: barbershopRouter,
  reservation: reservationRouter,
  review: reviewRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.barbershop.getAll();
 *       ^? Barbershop[]
 */
export const createCaller = createCallerFactory(appRouter);
