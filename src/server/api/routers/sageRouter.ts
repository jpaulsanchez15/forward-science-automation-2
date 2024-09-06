import {
  createTRPCRouter,
  // publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { z } from "zod";

const professionalProductLine = [
  "SalivaMax 10 pk",
  "PerioStom Initial Order",
  "PerioStom 16 pk",
];

export const sageRouter = createTRPCRouter({
  getOrder: protectedProcedure
    .input(z.object({ orderNumber: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.sageOrder.findUnique({
        where: {
          orderNumber: input.orderNumber,
        },
        include: {
          lines: true,
        },
      });
    }),
  getOrders: protectedProcedure.query(async ({ ctx }) => {
    const orders = await ctx.prisma.sageOrder.findMany({
      where: {
        fileAway: false,
      },
      include: {
        lines: true,
      },
    });
    return orders;
  }),

  getCompletedOrders: protectedProcedure.query(async ({ ctx, input }) => {
    const orders = await ctx.prisma.sageOrder.findMany({
      where: {
        fileAway: true,
        // created last month
        createdAt: {
          gte: "2024-01-01T00:00:00.000Z",
        },
      },
      include: {
        lines: {
          where: {
            productName: {
              in: professionalProductLine,
            },
          },
        },
      },
    });
    return orders;
  }),
  createOrder: protectedProcedure
    .input(
      z.object({
        orderNumber: z.string(),
        officeName: z.string(),
        ordoroLink: z.string(),
        dateOrdered: z.date(),
        trackingNumber: z.string(),
        products: z.object({
          salivaMax: z.number().optional(),
          perioStomInitial: z.number().optional(),
          perioStom: z.number().optional(),
        }),
        price: z.number(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.sageOrder.create({
        // TODO: This definitely needs to be changed.
        data: {
          orderNumber: input.orderNumber,
          officeName: input.officeName,
          createdAt: input.dateOrdered,
          createdBy: ctx.session.user?.name,
          ordoroLink: "",
          trackingNumber: "",
          lines: {
            create: [
              {
                productName: "SalivaMax 10 pk",
                sku: "42029121142953",
                quantity: input.products.salivaMax || 0,
                price: (input.products.salivaMax?.valueOf() ?? 0) * 120,
              },
              {
                productName: "PerioStom Initial Order",
                sku: "PS-SAGE INIT",
                quantity: input.products.perioStomInitial || 0,
                price: (input.products.perioStomInitial?.valueOf() ?? 0) * 168,
              },
              {
                productName: "PerioStom 16 pk",
                sku: "PS-1017",
                quantity: input.products.perioStom || 0,
                price: (input.products.perioStom?.valueOf() ?? 0) * 168,
              },
            ],
          },
        },
      });
    }),
  deleteOrder: protectedProcedure
    .input(
      z.object({
        orderNumber: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.sageOrder.delete({
        where: {
          orderNumber: input.orderNumber,
        },
      });
    }),
  completeOrder: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        fileAway: z.boolean(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.sageOrder.update({
        where: {
          id: input.id,
        },
        data: {
          fileAway: input.fileAway,
        },
        include: {
          lines: true,
        },
      });
    }),
  updateOrder: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        orderNumber: z.string().optional(),
        ordoroLink: z.string().optional(),
        // TODO: Add other optionals here.
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.sageOrder.update({
        where: {
          orderNumber: input.orderNumber,
        },
        data: {
          ordoroLink: input.ordoroLink,
        },
      });
    }),
});
