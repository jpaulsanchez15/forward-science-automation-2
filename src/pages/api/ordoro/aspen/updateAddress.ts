import { NextApiRequest, NextApiResponse } from "next";
import { env } from "../../../../env.mjs";

const ORDORO_API_USERNAME = env.ORDORO_API_USERNAME;
const ORDORO_API_PASSWORD = env.ORDORO_API_PASSWORD;

const updateAddress = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "PUT") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  } else {
    const { street1, street2, city, state, zip, country_code } = req.body;
    const resTwo = await fetch(
      `https://api.ordoro.com/v3/order/${req.query.orderNumber}/shipping_address`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(
            `${ORDORO_API_USERNAME}:${ORDORO_API_PASSWORD}`
          ).toString("base64")}`,
        },
        body: JSON.stringify({
          street1,
          street2,
          city,
          state,
          zip,
          country: country_code,
        }),
      }
    );

    const dataTwo = await resTwo.json();

    console.log(dataTwo);
    res.status(200).json({ dataTwo });
  }
};

export default updateAddress;
