import { env } from "@/env.mjs";
import type { ShopifyResponseType } from "@/types/shopify";
import { type NextApiRequest, type NextApiResponse } from "next";

const SHOPIFY_ACCESS_TOKEN = env.SHOPIFY_ACCESS_TOKEN;
const SHOPIFY_STORE_URL = env.NEXT_PUBLIC_SHOPIFY_STORE_URL;

export type ShopifyOrderType = {
  orders: Array<ShopifyResponseType>;
};

const getShopifyInfo = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    res.status(405).send("Method not allowed");
    return;
  } else {
    const response = await fetch(
      `${SHOPIFY_STORE_URL}.json?fulfillment_status=unfulfilled&status=open`, //&since_id=5055972704425
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN,
        },
      }
    );
    const data = (await response.json()) as ShopifyOrderType;

    res.status(200).json(data.orders);

    return data;
  }
};

export default getShopifyInfo;
