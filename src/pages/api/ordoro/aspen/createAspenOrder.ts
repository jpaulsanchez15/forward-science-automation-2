import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "../../../../env.mjs";
import { api } from "@/utils/api";

import type { SugarOffice } from "@/types/sugar/index";

const ORDORO_API_USERNAME = env.ORDORO_API_USERNAME;
const ORDORO_API_PASSWORD = env.ORDORO_API_PASSWORD;

const date = new Date();
const year = date.getFullYear();
const month = date.getMonth() + 1;
const day = date.getDate();
// TODO: See why this is fucked.
const formattedDate =
  year + (month < 10 ? "0" : "") + month + (day < 10 ? "0" : "") + day;

interface NextApiRequestWithBody extends NextApiRequest {
  body: {
    orderNumber: string;
  };
}

const createAspenOrder = async (
  req: NextApiRequestWithBody,
  res: NextApiResponse
) => {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  } else {
    // Actually creates the order for the label to then be made in Ordoro.
    const order = api.aspenOrder.getOrder.useQuery({
      orderNumber: req.body.orderNumber,
    });

    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    const getOfficeAddress = async () => {
      const officeOrderName = order.data?.officeName;
      const sugarOfficeId = await fetch(
        `https://forward-science-automation.vercel.app/api/sugar/aspen/findAspenOffice?officeName=${officeOrderName}`,
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

    const products = order.data?.lines.map((line) => {
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
      order_id: `${formattedDate}-${order.data?.orderNumber ?? ""}`,
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

    // TODO: Type Ordoro order
    const ordoroData = (await response.json()) as unknown;

    const { mutateAsync } = api.aspenOrder.updateOrder.useMutation();

    // TODO: Fix typing on this.
    const updatedOrder = await mutateAsync({
      id: order.data?.id ?? 0,
      orderNumber: req.body.orderNumber,
      ordoroLink: ordoroData?.order_id,
    }).catch((error) => console.error(error));

    res.status(201).json({ order: updatedOrder, message: "Order added to DB" });

    return;
  }
};

export default createAspenOrder;
