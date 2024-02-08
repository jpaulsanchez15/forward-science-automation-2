import { env } from "@/env.mjs";
import type { ShopifyResponseType } from "@/types/shopify";
import { type NextApiRequest, type NextApiResponse } from "next";

const SHOPIFY_ACCESS_TOKEN = env.SHOPIFY_ACCESS_TOKEN;
const SHOPIFY_STORE_URL = env.NEXT_PUBLIC_SHOPIFY_STORE_URL;

export type ShopifyOrderType = {
  orders: Array<ShopifyResponseType>;
};

const currentDate = new Date();

const getShopifyInfo = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    res.status(405).send("Method not allowed");
    return;
  } else {
    const response = await fetch(
      `${SHOPIFY_STORE_URL}.json?limit=250&status=closed&created_at_min=2024-01-01T00:00:00.000Z&created_at_max=${currentDate.toISOString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN,
        },
      }
    );
    const data = (await response.json()) as ShopifyOrderType;

    res.status(200).json({
      orders: data.orders,
    });

    return data;
  }
};

export default getShopifyInfo;

// const checkProfessionalProductLine = (order: ShopifyOrderType) => {
//   const items = order.orders.map((order) => {
//     return order.line_items;
//   });

//   const check = items.filter((item) => {
//     return item.map((product) => {
//       professionalProductLine.includes(product.sku) ? item : null;
//     }, []);
//   });

//   return check;
// };

// const professionalProductLine = ["BS-01-10", "TS-16-6", "OX-13-6"];
