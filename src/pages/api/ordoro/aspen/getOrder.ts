import { NextApiRequest, NextApiResponse } from "next";
import { env } from "../../../../env.mjs";

const ORDORO_API_USERNAME = env.ORDORO_API_USERNAME;
const ORDORO_API_PASSWORD = env.ORDORO_API_PASSWORD;

const checkAspenOrder = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  } else {
    const response = await fetch(
      `https://api.ordoro.com/v3/order/${req.query.orderNumber}`,
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

    if (response.status == 404) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    const dataTwo = await response.json();

    console.log(response);
    res.status(200).json({ dataTwo });
  }
};

export default checkAspenOrder;
