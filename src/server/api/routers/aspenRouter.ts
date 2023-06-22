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
        // TODO: Fix this.
        data: {
          orderNumber: input.orderNumber,
          officeName: input.officeName,
          ordoroLink: "",
          trackingNumber: "",
          price: input.price,
          lines: {
            create: [
              {
                productName: "TheraStom",
                sku: "TS-16-12",
                quantity: input.products.theraStom || 0,
              },
              {
                productName: "OxiStom",
                quantity: input.products.oxiStom,
              },
              {
                productName: "SalivaMax",
                quantity: input.products.salivaMax,
              },
              {
                productName: "OralID",
                quantity: input.products.oralID,
              },
              {
                productName: "accessories",
                quantity: input.products.accessories.fs88,
              },
            ],
          },
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
