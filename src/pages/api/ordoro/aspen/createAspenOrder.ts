import { env } from "@/env.mjs";
import type { NextApiResponse } from "next";

import { prisma } from "@/server/db";
import type { NextApiRequestWithBody, OrdoroOrder } from "@/types/ordoro";
import type { SugarOffice } from "@/types/sugar/index";

const ORDORO_API_USERNAME = env.ORDORO_API_USERNAME;
const ORDORO_API_PASSWORD = env.ORDORO_API_PASSWORD;

interface NewBody extends NextApiRequestWithBody {
  body: {
    orderNumber: string;
    id: string;
  };
}

const date = new Date();
const year = date.getFullYear();
const month = date.getMonth() + 1;
const day = date.getDate();

const formattedDate =
  year.toString() +
  (month < 10 ? "0" : "") +
  month.toString() +
  (day < 10 ? "0" : "") +
  day.toString();

const createAspenOrder = async (req: NewBody, res: NextApiResponse) => {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  } else {
    // console.log(req.body);
    // Actually creates the order for the label to then be made in Ordoro.
    const order = await prisma.aspenOrder.findUnique({
      where: {
        orderNumber: req.body.orderNumber ?? "",
      },
      include: {
        lines: true,
      },
    });

    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    const getOfficeAddress = async () => {
      const officeOrderName = order.officeName;
      const sugarOfficeId = await fetch(
        `https://forward-science-automation.vercel.app/api/sugar/aspen/findAspenOffice?officeName=${
          officeOrderName ?? ""
        }`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = (await sugarOfficeId.json()) as SugarOffice[];

      const {
        name,
        shipping_address_street,
        shipping_address_city,
        shipping_address_state,
        shipping_address_postalcode,
        shipping_address_country,
      } = data[0] ?? {
        name: "",
        shipping_address_street: "",
        shipping_address_city: "",
        shipping_address_state: "",
        shipping_address_postalcode: "",
        shipping_address_country: "",
      };

      const address = {
        name,
        street1: shipping_address_street,
        city: shipping_address_city,
        state: shipping_address_state,
        zip: shipping_address_postalcode,
        country: shipping_address_country,
      };
      return address;
    };

    const shippingAddress = await getOfficeAddress();
    const billingAddress = shippingAddress;

    const nameMap = {
      TheraStom: "TheraStom 12 pk",
      OxiStom: "OxiStom 6 pk",
      SalivaMax: "SalivaMAX® 10 pk of 30 ct boxes",
      OralID: "OralID Kit (FS-11) Default Title",
      // TODO: Expand on this so it matches what we did earlier.
      accessories: "Customized Shipment",
    };

    const priceMap = {
      TheraStom: 63,
      OxiStom: 25.5,
      SalivaMax: 110,
      OralID: 995,
      accessories: 0,
    };

    const productArray = order.lines
      .map((line) => {
        const productNameKey = line.productName as keyof typeof nameMap;
        const priceKey = line.productName as keyof typeof priceMap;

        return {
          product: {
            name: nameMap[productNameKey],
            sku: line.sku,
            price: priceMap[priceKey],
          },
          quantity: line.quantity,
          total_price: priceMap[priceKey] * line.quantity,
        };
      })
      .filter((line) => line.quantity > 0);

    const payload = JSON.stringify({
      order_id: `${formattedDate}-${order.orderNumber ?? ""}`,
      billing_address: billingAddress,
      shipping_address: shippingAddress,
      lines: productArray,
    });

    const response = await fetch(`https://api.ordoro.com/v3/order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(
          `${ORDORO_API_USERNAME}:${ORDORO_API_PASSWORD}`
        ).toString("base64")}`,
      },
      body: payload,
    });

    const ordoroData = (await response.json()) as OrdoroOrder;
    console.log(ordoroData);

    const updatedOrder = await prisma.aspenOrder.update({
      where: {
        orderNumber: req.body.orderNumber,
      },
      data: {
        ordoroLink: `${ordoroData.link ?? ""}`,
      },
    });

    res
      .status(201)
      .json({ order: updatedOrder, message: "Order created in Ordoro." });

    return;
  }
};

export default createAspenOrder;
