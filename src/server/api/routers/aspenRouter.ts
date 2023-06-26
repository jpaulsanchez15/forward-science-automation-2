import {
  createTRPCRouter,
  // publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { z } from "zod";

export const aspenRouter = createTRPCRouter({
  getOrder: protectedProcedure
    .input(z.object({ orderNumber: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.aspenOrder.findUnique({
        where: {
          orderNumber: input.orderNumber,
        },
        include: {
          lines: true,
        },
      });
    }),
  getOrders: protectedProcedure.query(async ({ ctx }) => {
    const orders = await ctx.prisma.aspenOrder.findMany({
      where: {
        fileAway: false,
      },
      include: {
        lines: true,
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
        trackingNumber: z.string(),
        products: z.object({
          theraStom: z.number().optional(),
          oxiStom: z.number().optional(),
          salivaMax: z.number().optional(),
          oralID: z.number().optional(),
          accessories: z.object({
            fs88: z.number().optional(),
            fs84: z.number().optional(),
          }),
        }),
        price: z.number(),
      })
    )
    .mutation(({ ctx, input }) => {
      // TODO: Change the input here for this.
      return ctx.prisma.aspenOrder.create({
        // TODO: Look into pricing, seems bugged.
        data: {
          orderNumber: input.orderNumber,
          officeName: input.officeName,
          ordoroLink: "",
          trackingNumber: "",
          lines: {
            create: [
              {
                productName: "TheraStom",
                sku: "TS-16-12",
                quantity: input.products.theraStom || 0,
                price: (input.products.theraStom?.valueOf() ?? 0) * 63,
              },
              {
                productName: "OxiStom",
                sku: "OX-13-6",
                quantity: input.products.oxiStom || 0,
                price: (input.products.oxiStom?.valueOf() ?? 0) * 25.5,
              },
              {
                productName: "SalivaMax",
                sku: "42029121142953",
                quantity: input.products.salivaMax || 0,
                price: (input.products.salivaMax?.valueOf() ?? 0) * 120,
              },
              {
                productName: "OralID",
                sku: "FS-11",
                quantity: input.products.oralID || 0,
                price: (input.products.oralID?.valueOf() ?? 0) * 1200,
              },
              {
                productName: "FS88",
                sku: "FS-88",
                quantity: input.products.accessories.fs88 || 0,
                price: (input.products.accessories.fs88 ?? 0) * 20,
              },
              {
                productName: "FS84",
                sku: "FS-84",
                quantity: input.products.accessories.fs84 || 0,
                price: (input.products.accessories.fs84 ?? 0) * 20,
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
      return ctx.prisma.aspenOrder.delete({
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
      return ctx.prisma.aspenOrder.update({
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
      return ctx.prisma.aspenOrder.update({
        where: {
          orderNumber: input.orderNumber,
        },
        data: {
          ordoroLink: input.ordoroLink,
        },
      });
    }),
});
