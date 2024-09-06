import {
  type AspenOrderBody,
  type OrdoroLabelResponseType,
} from "@/types/ordoro";
import { type NextApiResponse } from "next";
import { env } from "../../../../env.mjs";
import { prisma } from "../../../../server/db";

const ORDORO_API_USERNAME = env.ORDORO_API_USERNAME;
const ORDORO_API_PASSWORD = env.ORDORO_API_PASSWORD;

const createSageLabel = async (req: AspenOrderBody, res: NextApiResponse) => {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  } else {
    // Creates the label for the previously created order.
    const createLabelRes = await fetch(
      `https://api.ordoro.com/v3${req.body.num}/label/fedex`,
      {
        method: "POST",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(
            `${ORDORO_API_USERNAME}:${ORDORO_API_PASSWORD}`
          ).toString("base64")}`,
        },
        body: JSON.stringify(req.body.lines),
      }
    );

    if (createLabelRes.status == 404) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    const data = (await createLabelRes.json()) as OrdoroLabelResponseType;

    console.log(data);

    //@ts-ignore
    if (data.error_message) {
      //@ts-ignore
      res.status(500).json({ message: data.error_message });
      return;
    }

    if (data && data.tracking_number) {
      const updatedOrder = await prisma.sageOrder.update({
        where: {
          orderNumber: req.body.num.slice(18),
        },
        data: {
          trackingNumber: data?.tracking_number,
          orderNumber: req.body.num.slice(18),
        },
      });

      res.status(201).json({
        order: updatedOrder,
        message: "Tracking added to DB",
        data: data,
      });
    } else {
      res.status(500).json({ message: "Custom error message" });
    }

    // RETURN TRACKING NUMBER
    return;
  }
};

export default createSageLabel;
