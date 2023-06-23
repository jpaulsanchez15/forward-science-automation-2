import type { NextApiResponse } from "next";
import { env } from "@/env.mjs";

import type { SugarOffice } from "@/types/sugar/index";
import type { OrdoroOrder } from "@/types/ordoro";
import type { NextApiRequestWithBody } from "@/types/ordoro";
import { prisma } from "@/server/db";

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
    console.log(req.body);
    // Actually creates the order for the label to then be made in Ordoro.
    const order = await prisma.aspenOrder.findUnique({
      where: {
        orderNumber: req.body.orderNumber ?? "",
        // id: req.body.id ?? "",
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
      console.log("sugaroffice", data[0]?.id);

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
      therastom: "TheraStom 12 pk",
      oxistom: "OxiStom 6 pk",
      salivamax: "SalivaMAX® 10 pk of 30 ct boxes",
      oralid: "OralID Kit (FS-11) Default Title",
      accessories: "Customized Shipment",
    };

    const skuMap = {
      therastom: "TS-16-12",
      oxistom: "OX-13-6",
      salivamax: "42029121142953",
      oralid: "FS-11",
      accessories: "IDFL-Custom",
    };

    const priceMap = {
      therastom: 63,
      oxistom: 25.5,
      salivamax: 110,
      oralid: 995,
      accessories: 0,
    };

    const products = order.lines.map((line) => {
      return {
        [line.productName]: line.quantity,
      };
    });

    const productArray = Object.entries(products ?? {})
      .map(([productName, quantity]) => ({
        product: {
          name: nameMap[productName as keyof typeof nameMap],
          sku: skuMap[productName as keyof typeof skuMap],
          price: priceMap[productName as keyof typeof priceMap],
        },
        quantity,
        total_price: priceMap[productName as keyof typeof priceMap] * +quantity,
      }))
      .filter((product) => +product?.quantity > 0);

    const payload = JSON.stringify({
      order_id: `${formattedDate}-${order.orderNumber ?? ""}`,
      billing_address: billingAddress,
      shipping_address: shippingAddress,
      lines: productArray,
    });

    console.log("payload", payload);

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

    console.log("ordororesponse", response);

    const ordoroData = (await response.json()) as OrdoroOrder;

    const updatedOrder = await prisma.aspenOrder.update({
      where: {
        orderNumber: req.body.orderNumber,
      },
      data: {
        ordoroLink: `${ordoroData.order_number ?? ""}`,
      },
    });

    res.status(201).json({ order: updatedOrder, message: "Order added to DB" });

    return;
  }
};

export default createAspenOrder;
