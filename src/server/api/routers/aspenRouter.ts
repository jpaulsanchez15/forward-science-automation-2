import { z } from "zod";
import {
  createTRPCRouter,
  // publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";

export const aspenRouter = createTRPCRouter({
  getOrders: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(({ ctx }) => {
      return ctx.prisma.aspenOrder.findMany({
        where: {
          trackingNumber: {
            equals: "",
          },
        },
      });
    }),
  createOrder: protectedProcedure
    .input(
      z.object({
        orderNumber: z.string(),
        officeName: z.string(),
        ordoroLink: z.string(),
        trackingNumber: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      // TODO: Change the input here for this.
      return ctx.prisma.aspenOrder.create({
        data: {
          orderNumber: input.orderNumber,
          officeName: input.officeName,
          ordoroLink: input.ordoroLink,
          trackingNumber: input.trackingNumber,
        },
      });
    }),
  deleteOrder: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.aspenOrder.delete({
        where: {
          id: input.id,
        },
      });
    }),
  completeOrder: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        trackingNumber: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.aspenOrder.update({
        where: {
          id: input.id,
        },
        data: {
          trackingNumber: input.trackingNumber,
        },
      });
    }),
  updateOrder: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        orderNumber: z.string().optional(),
        // TODO: Add other optionals here.
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.aspenOrder.update({
        where: {
          id: input.id,
        },
        data: {
          orderNumber: input.orderNumber,
        },
      });
    }),
});
