import type { NextApiRequest } from "next";
import * as z from "zod";

export const TagSchema = z.object({
  color: z.union([z.null(), z.string()]).optional(),
  text: z.union([z.null(), z.string()]).optional(),
  link: z.union([z.null(), z.string()]).optional(),
  id: z.union([z.number(), z.null()]).optional(),
});
export type Tag = z.infer<typeof TagSchema>;

export const LineSchema = z.object({
  quantity: z.union([z.number(), z.null()]).optional(),
  item_price: z.union([z.number(), z.null()]).optional(),
  link: z.union([z.null(), z.string()]).optional(),
  product_name: z.union([z.null(), z.string()]).optional(),
  product_link: z.union([z.null(), z.string()]).optional(),
  sku: z.union([z.null(), z.string()]).optional(),
  shippability: z.union([z.null(), z.string()]).optional(),
  details: z.union([z.null(), z.string()]).optional(),
});
export type Line = z.infer<typeof LineSchema>;

export const FinancialSchema = z.object({
  grand_total: z.union([z.number(), z.null()]).optional(),
  tax_amount: z.union([z.number(), z.null()]).optional(),
  product_amount: z.union([z.number(), z.null()]).optional(),
  shipping_amount: z.union([z.number(), z.null()]).optional(),
  credit_card_issuer: z.null().optional(),
  discount_amount: z.union([z.number(), z.null()]).optional(),
});
export type Financial = z.infer<typeof FinancialSchema>;

export const ShippingInfoSchema = z.object({});
export type ShippingInfo = z.infer<typeof ShippingInfoSchema>;

export const CartSchema = z.object({
  link: z.union([z.null(), z.string()]).optional(),
  id: z.union([z.number(), z.null()]).optional(),
});
export type Cart = z.infer<typeof CartSchema>;

export const ValidationSchema = z.object({
  status: z.union([z.null(), z.string()]).optional(),
  suggested: z.union([z.array(z.any()), z.null()]).optional(),
  additional_text: z.null().optional(),
});
export type Validation = z.infer<typeof ValidationSchema>;

export const IngAddressSchema = z.object({
  city: z.union([z.null(), z.string()]).optional(),
  state: z.union([z.null(), z.string()]).optional(),
  name: z.union([z.null(), z.string()]).optional(),
  zip: z.union([z.null(), z.string()]).optional(),
  country: z.union([z.null(), z.string()]).optional(),
  street1: z.union([z.null(), z.string()]).optional(),
  company: z.null().optional(),
  street2: z.null().optional(),
  phone: z.union([z.null(), z.string()]).optional(),
  email: z.union([z.null(), z.string()]).optional(),
  validation: z.union([ValidationSchema, z.null()]).optional(),
});
export type IngAddress = z.infer<typeof IngAddressSchema>;

export const OrdoroOrderSchema = z.object({
  updated_date: z.union([z.null(), z.string()]).optional(),
  status: z.union([z.null(), z.string()]).optional(),
  notes_from_customer: z.null().optional(),
  billing_address: z.union([IngAddressSchema, z.null()]).optional(),
  financial: z.union([FinancialSchema, z.null()]).optional(),
  requested_shipping_method: z.null().optional(),
  tags: z.union([z.array(TagSchema), z.null()]).optional(),
  shipping_info: z.union([ShippingInfoSchema, z.null()]).optional(),
  weight: z.union([z.number(), z.null()]).optional(),
  shipping_address: z.union([IngAddressSchema, z.null()]).optional(),
  lines: z.union([z.array(LineSchema), z.null()]).optional(),
  cart: z.union([CartSchema, z.null()]).optional(),
  dropshipping_info: z.union([ShippingInfoSchema, z.null()]).optional(),
  order_placed_date: z.union([z.null(), z.string()]).optional(),
  return_shipping_info: z.union([ShippingInfoSchema, z.null()]).optional(),
  created_date: z.union([z.null(), z.string()]).optional(),
  warehouse: z.union([CartSchema, z.null()]).optional(),
  order_number: z.union([z.null(), z.string()]).optional(),
  barcode: z.union([z.null(), z.string()]).optional(),
  comments: z.union([z.array(z.any()), z.null()]).optional(),
  link: z.union([z.null(), z.string(), z.undefined()]).optional(),
});
export type OrdoroOrder = z.infer<typeof OrdoroOrderSchema>;

export interface NextApiRequestWithBody extends NextApiRequest {
  body: {
    orderNumber: string;
  };
}
