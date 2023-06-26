import type { Prisma } from "@prisma/client";
import * as z from "zod";

export const DecimalJSLikeSchema: z.ZodType<Prisma.DecimalJsLike> = z.object({
  d: z.array(z.number()),
  e: z.number(),
  s: z.number(),
  toFixed: z.function().args().returns(z.string()),
});

export const DecimalJSLikeListSchema: z.ZodType<Prisma.DecimalJsLike[]> = z
  .object({
    d: z.array(z.number()),
    e: z.number(),
    s: z.number(),
    toFixed: z.function().args().returns(z.string()),
  })
  .array();

export const DECIMAL_STRING_REGEX = /^[0-9.,e+-bxffo_cp]+$|Infinity|NaN/;

export const isValidDecimalInput = (
  v?: null | string | number | Prisma.DecimalJsLike
): v is string | number | Prisma.DecimalJsLike => {
  if (v === undefined || v === null) return false;
  return (
    (typeof v === "object" &&
      "d" in v &&
      "e" in v &&
      "s" in v &&
      "toFixed" in v) ||
    (typeof v === "string" && DECIMAL_STRING_REGEX.test(v)) ||
    typeof v === "number"
  );
};
// SCHEMA
//------------------------------------------------------
export const LineSchema = z.object({
  id: z.string(),
  quantity: z.number(),
  sku: z.string(),
  productName: z.string(),
  price: z
    .union([z.number(), z.string(), DecimalJSLikeSchema])
    .refine((v) => isValidDecimalInput(v), {
      message:
        "Field 'decimal' must be a Decimal. Location: ['Models', 'DecimalModel']",
    }),
  shopifyOrderId: z.string().optional().nullable(),
  aspenOrderId: z.string().optional().nullable(),
});
export type Line = z.infer<typeof LineSchema>;

export const GetOrdersTypeSchema = z.object({
  id: z.string().nullable(),
  orderNumber: z.string().nullable(),
  createdAt: z.date().nullable(),
  officeName: z.string().nullable(),
  ordoroLink: z.string().nullable(),
  createdBy: z.string().nullable(),
  trackingNumber: z.string().nullable(),
  userId: z.string().nullable(),
  lines: z.array(LineSchema),
  fileAway: z.boolean().nullable(),
});
export type GetOrdersType = z.infer<typeof GetOrdersTypeSchema>;
