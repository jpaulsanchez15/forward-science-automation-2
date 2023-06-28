import { env } from "@/env.mjs";
import { OrdoroOrder } from "@/types/ordoro";
import { type NextApiRequest, type NextApiResponse } from "next";

const ORDORO_API_USERNAME = env.ORDORO_API_USERNAME;
const ORDORO_API_PASSWORD = env.ORDORO_API_PASSWORD;
const ORDORO_API_URL = env.ORDORO_API_URL;

interface Order {
  order_number: string;
}

const getUnfullfiledOrders = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method !== "GET") {
    res.status(405).send("Method not allowed");
    return;
  } else {
    const response = await fetch(
      `${ORDORO_API_URL}?status=awaiting_fulfillment`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(
            `${ORDORO_API_USERNAME}:${ORDORO_API_PASSWORD}`
          ).toString("base64")}`,
        },
      }
    );
    const data = (await response.json()) as any;

    res
      .status(200)
      .json(
        data.order
          .sort((a: any, b: any) =>
            a.order_number > b.order_number
              ? -1
              : b.order_number > a.order_number
              ? 1
              : 0
          )
          .filter((order: any) => order?.order_number.startsWith("1-"))
      );

    return data;
  }
};

export default getUnfullfiledOrders;
