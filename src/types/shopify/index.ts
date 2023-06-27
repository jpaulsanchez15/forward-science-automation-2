import * as z from "zod";

export const CurrencySchema = z.enum(["USD"]);
export type Currency = z.infer<typeof CurrencySchema>;

export const MoneySchema = z.object({
  amount: z.string(),
  currency_code: CurrencySchema,
});
export type Money = z.infer<typeof MoneySchema>;

export const SetSchema = z.object({
  shop_money: MoneySchema,
  presentment_money: MoneySchema,
});
export type Set = z.infer<typeof SetSchema>;

export const ShippingLineSchema = z.object({
  id: z.number(),
  carrier_identifier: z.string(),
  code: z.string(),
  delivery_category: z.null(),
  discounted_price: z.string(),
  discounted_price_set: SetSchema,
  phone: z.null(),
  price: z.string(),
  price_set: SetSchema,
  requested_fulfillment_service_id: z.null(),
  source: z.string(),
  title: z.string(),
  tax_lines: z.array(z.any()),
  discount_allocations: z.array(z.any()),
});
export type ShippingLine = z.infer<typeof ShippingLineSchema>;

export const FluffyCardSchema = z.object({
  acquirer_reference_number: z.null(),
  acquirer_reference_number_status: z.string(),
});
export type FluffyCard = z.infer<typeof FluffyCardSchema>;

export const ReceiptPaymentMethodDetailsSchema = z.object({
  card: FluffyCardSchema,
  type: z.string(),
});
export type ReceiptPaymentMethodDetails = z.infer<
  typeof ReceiptPaymentMethodDetailsSchema
>;

export const ReceiptMetadataSchema = z.object({
  order_transaction_id: z.string(),
  payments_refund_id: z.string(),
});
export type ReceiptMetadata = z.infer<typeof ReceiptMetadataSchema>;

export const NetworkTokenSchema = z.object({
  used: z.boolean(),
});
export type NetworkToken = z.infer<typeof NetworkTokenSchema>;

export const ChecksSchema = z.object({
  address_line1_check: z.string(),
  address_postal_code_check: z.string(),
  cvc_check: z.string(),
});
export type Checks = z.infer<typeof ChecksSchema>;

export const PurpleCardSchema = z.object({
  amount_authorized: z.number(),
  brand: z.string(),
  checks: ChecksSchema,
  country: z.string(),
  description: z.string(),
  ds_transaction_id: z.null(),
  exp_month: z.number(),
  exp_year: z.number(),
  fingerprint: z.string(),
  funding: z.string(),
  iin: z.string(),
  installments: z.null(),
  issuer: z.string(),
  last4: z.string(),
  mandate: z.null(),
  moto: z.null(),
  network: z.string(),
  network_token: NetworkTokenSchema,
  network_transaction_id: z.string(),
  overcapture_supported: z.boolean(),
  payment_account_reference: z.string(),
  three_d_secure: z.null(),
  wallet: z.null(),
});
export type PurpleCard = z.infer<typeof PurpleCardSchema>;

export const ChargePaymentMethodDetailsSchema = z.object({
  card: PurpleCardSchema,
  type: z.string(),
});
export type ChargePaymentMethodDetails = z.infer<
  typeof ChargePaymentMethodDetailsSchema
>;

export const OutcomeSchema = z.object({
  network_status: z.string(),
  reason: z.null(),
  risk_level: z.string(),
  seller_message: z.string(),
  type: z.string(),
});
export type Outcome = z.infer<typeof OutcomeSchema>;

export const PurpleMitParamsSchema = z.object({
  network_transaction_id: z.string(),
});
export type PurpleMitParams = z.infer<typeof PurpleMitParamsSchema>;

export const ChargeMetadataSchema = z.object({
  email: z.string(),
  manual_entry: z.string(),
  order_id: z.string(),
  order_transaction_id: z.string(),
  payments_charge_id: z.string(),
  shop_id: z.string(),
  shop_name: z.string(),
  transaction_fee_tax_amount: z.string(),
  transaction_fee_total_amount: z.string(),
});
export type ChargeMetadata = z.infer<typeof ChargeMetadataSchema>;

export const FraudDetailsClassSchema = z.object({});
export type FraudDetailsClass = z.infer<typeof FraudDetailsClassSchema>;

export const ChargeSchema = z.object({
  id: z.string(),
  object: z.string(),
  amount: z.number(),
  application_fee: z.string(),
  balance_transaction: z.string(),
  captured: z.boolean(),
  created: z.number(),
  currency: z.string(),
  failure_code: z.null(),
  failure_message: z.null(),
  fraud_details: FraudDetailsClassSchema,
  livemode: z.boolean(),
  metadata: ChargeMetadataSchema,
  outcome: OutcomeSchema,
  paid: z.boolean(),
  payment_intent: z.string(),
  payment_method: z.string(),
  payment_method_details: ChargePaymentMethodDetailsSchema,
  refunded: z.boolean(),
  source: z.null(),
  status: z.string(),
  mit_params: PurpleMitParamsSchema,
});
export type Charge = z.infer<typeof ChargeSchema>;

export const BalanceTransactionSchema = z.object({
  id: z.string(),
  object: z.string(),
  exchange_rate: z.null(),
});
export type BalanceTransaction = z.infer<typeof BalanceTransactionSchema>;

export const ReceiptSchema = z.object({
  id: z.string(),
  amount: z.number(),
  balance_transaction: BalanceTransactionSchema,
  charge: ChargeSchema,
  object: z.string(),
  reason: z.null(),
  status: z.string(),
  created: z.number(),
  currency: z.string(),
  metadata: ReceiptMetadataSchema,
  payment_method_details: ReceiptPaymentMethodDetailsSchema,
  mit_params: FraudDetailsClassSchema,
});
export type Receipt = z.infer<typeof ReceiptSchema>;

export const PaymentsRefundAttributesSchema = z.object({
  status: z.string(),
  acquirer_reference_number: z.string(),
});
export type PaymentsRefundAttributes = z.infer<
  typeof PaymentsRefundAttributesSchema
>;

export const PaymentDetailsSchema = z.object({
  credit_card_bin: z.string(),
  avs_result_code: z.string(),
  cvv_result_code: z.string(),
  credit_card_number: z.string(),
  credit_card_company: z.string(),
  buyer_action_info: z.null(),
});
export type PaymentDetails = z.infer<typeof PaymentDetailsSchema>;

export const OriginLocationSchema = z.object({
  id: z.number(),
  country_code: z.string(),
  province_code: z.string(),
  name: z.string(),
  address1: z.string(),
  address2: z.string(),
  city: z.string(),
  zip: z.string(),
});
export type OriginLocation = z.infer<typeof OriginLocationSchema>;

export const TransactionSchema = z.object({
  id: z.number(),
  admin_graphql_api_id: z.string(),
  amount: z.string(),
  authorization: z.string(),
  created_at: z.string(),
  currency: CurrencySchema,
  device_id: z.null(),
  error_code: z.null(),
  gateway: z.string(),
  kind: z.string(),
  location_id: z.null(),
  message: z.string(),
  order_id: z.number(),
  parent_id: z.number(),
  payments_refund_attributes: PaymentsRefundAttributesSchema,
  processed_at: z.string(),
  receipt: ReceiptSchema,
  source_name: z.string(),
  status: z.string(),
  test: z.boolean(),
  user_id: z.number(),
  payment_details: PaymentDetailsSchema,
});
export type Transaction = z.infer<typeof TransactionSchema>;
export const LineItemSchema = z.object({
  id: z.number(),
  admin_graphql_api_id: z.string(),
  fulfillable_quantity: z.number(),
  fulfillment_service: z.string(),
  fulfillment_status: z.null(),
  gift_card: z.boolean(),
  grams: z.number(),
  name: z.string(),
  origin_location: OriginLocationSchema,
  price: z.string(),
  price_set: SetSchema,
  product_exists: z.boolean(),
  product_id: z.number(),
  properties: z.array(z.any()),
  quantity: z.number(),
  requires_shipping: z.boolean(),
  sku: z.string(),
  taxable: z.boolean(),
  title: z.string(),
  total_discount: z.string(),
  total_discount_set: SetSchema,
  variant_id: z.number(),
  variant_inventory_management: z.string(),
  variant_title: z.string(),
  vendor: z.string(),
  tax_lines: z.array(z.any()),
  duties: z.array(z.any()),
  discount_allocations: z.array(z.any()),
});
export type LineItem = z.infer<typeof LineItemSchema>;

export const RefundLineItemSchema = z.object({
  id: z.number(),
  line_item_id: z.number(),
  location_id: z.number(),
  quantity: z.number(),
  restock_type: z.string(),
  subtotal: z.number(),
  subtotal_set: SetSchema,
  total_tax: z.number(),
  total_tax_set: SetSchema,
  line_item: LineItemSchema,
});
export type RefundLineItem = z.infer<typeof RefundLineItemSchema>;

export const OrderAdjustmentSchema = z.object({
  id: z.number(),
  amount: z.string(),
  amount_set: SetSchema,
  kind: z.string(),
  order_id: z.number(),
  reason: z.string(),
  refund_id: z.number(),
  tax_amount: z.string(),
  tax_amount_set: SetSchema,
});
export type OrderAdjustment = z.infer<typeof OrderAdjustmentSchema>;

export const RefundSchema = z.object({
  id: z.number(),
  admin_graphql_api_id: z.string(),
  created_at: z.string(),
  note: z.string(),
  order_id: z.number(),
  processed_at: z.string(),
  restock: z.boolean(),
  total_duties_set: SetSchema,
  user_id: z.number(),
  order_adjustments: z.array(OrderAdjustmentSchema),
  transactions: z.array(TransactionSchema),
  refund_line_items: z.array(RefundLineItemSchema),
  duties: z.array(z.any()),
});
export type Refund = z.infer<typeof RefundSchema>;

export const AddressSchema = z.object({
  first_name: z.string(),
  address1: z.string(),
  phone: z.string(),
  city: z.string(),
  zip: z.string(),
  province: z.string(),
  country: z.string(),
  last_name: z.string(),
  address2: z.null(),
  company: z.null(),
  latitude: z.union([z.number(), z.null()]).optional(),
  longitude: z.union([z.number(), z.null()]).optional(),
  name: z.string(),
  country_code: z.string(),
  province_code: z.string(),
  id: z.union([z.number(), z.null()]).optional(),
  customer_id: z.union([z.number(), z.null()]).optional(),
  country_name: z.union([z.null(), z.string()]).optional(),
  default: z.union([z.boolean(), z.null()]).optional(),
});
export type Address = z.infer<typeof AddressSchema>;

export const CustomerSchema = z.object({
  id: z.number(),
  email: z.string(),
  accepts_marketing: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  orders_count: z.number(),
  state: z.string(),
  total_spent: z.string(),
  last_order_id: z.number(),
  note: z.string(),
  verified_email: z.boolean(),
  multipass_identifier: z.null(),
  tax_exempt: z.boolean(),
  phone: z.null(),
  sms_marketing_consent: z.null(),
  tags: z.string(),
  currency: CurrencySchema,
  last_order_name: z.string(),
  accepts_marketing_updated_at: z.string(),
  marketing_opt_in_level: z.string(),
  tax_exemptions: z.array(z.any()),
  admin_graphql_api_id: z.string(),
  default_address: AddressSchema,
});
export type Customer = z.infer<typeof CustomerSchema>;

export const ClientDetailsSchema = z.object({
  accept_language: z.string(),
  browser_height: z.null(),
  browser_ip: z.string(),
  browser_width: z.null(),
  session_hash: z.null(),
  user_agent: z.string(),
});
export type ClientDetails = z.infer<typeof ClientDetailsSchema>;

export const ShopifyResponseTypeSchema = z.object({
  id: z.number(),
  admin_graphql_api_id: z.string(),
  app_id: z.number(),
  browser_ip: z.string(),
  buyer_accepts_marketing: z.boolean(),
  cancel_reason: z.null(),
  cancelled_at: z.null(),
  cart_token: z.string(),
  checkout_id: z.number(),
  checkout_token: z.string(),
  client_details: ClientDetailsSchema,
  closed_at: z.null(),
  confirmed: z.boolean(),
  contact_email: z.string(),
  created_at: z.string(),
  currency: CurrencySchema,
  current_subtotal_price: z.string(),
  current_subtotal_price_set: SetSchema,
  current_total_discounts: z.string(),
  current_total_discounts_set: SetSchema,
  current_total_duties_set: z.null(),
  current_total_price: z.string(),
  current_total_price_set: SetSchema,
  current_total_tax: z.string(),
  current_total_tax_set: SetSchema,
  customer_locale: z.string(),
  device_id: z.null(),
  discount_codes: z.array(z.any()),
  email: z.string(),
  estimated_taxes: z.boolean(),
  financial_status: z.string(),
  fulfillment_status: z.null(),
  gateway: z.string(),
  landing_site: z.string(),
  landing_site_ref: z.null(),
  location_id: z.null(),
  name: z.string(),
  note: z.null(),
  note_attributes: z.array(z.any()),
  number: z.number(),
  order_number: z.number(),
  order_status_url: z.string(),
  original_total_duties_set: z.null(),
  payment_gateway_names: z.array(z.string()),
  phone: z.null(),
  presentment_currency: CurrencySchema,
  processed_at: z.string(),
  processing_method: z.string(),
  reference: z.string(),
  referring_site: z.string(),
  source_identifier: z.string(),
  source_name: z.string(),
  source_url: z.null(),
  subtotal_price: z.string(),
  subtotal_price_set: SetSchema,
  tags: z.string(),
  tax_lines: z.array(z.any()),
  taxes_included: z.boolean(),
  test: z.boolean(),
  token: z.string(),
  total_discounts: z.string(),
  total_discounts_set: SetSchema,
  total_line_items_price: z.string(),
  total_line_items_price_set: SetSchema,
  total_outstanding: z.string(),
  total_price: z.string(),
  total_price_set: SetSchema,
  total_price_usd: z.string(),
  total_shipping_price_set: SetSchema,
  total_tax: z.string(),
  total_tax_set: SetSchema,
  total_tip_received: z.string(),
  total_weight: z.number(),
  updated_at: z.string(),
  user_id: z.null(),
  billing_address: AddressSchema,
  customer: CustomerSchema,
  discount_applications: z.array(z.any()),
  fulfillments: z.array(z.any()),
  line_items: z.array(LineItemSchema),
  payment_details: PaymentDetailsSchema,
  payment_terms: z.null(),
  refunds: z.array(RefundSchema),
  shipping_address: AddressSchema,
  shipping_lines: z.array(ShippingLineSchema),
});
export type ShopifyResponseType = z.infer<typeof ShopifyResponseTypeSchema>;
