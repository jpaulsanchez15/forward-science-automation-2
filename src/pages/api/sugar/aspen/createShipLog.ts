import { env } from "@/env.mjs";
import type { SugarOffice } from "@/types/sugar/index";
import { type NextApiRequest, type NextApiResponse } from "next";

import sugarMiddleware from "../middleware";

const SUGAR_BASE_URL = env.SUGAR_BASE_URL;

interface NextApiRequestWithSugarToken extends NextApiRequest {
  access_token: string;
  body: {
    description: string;
    name: string;
    order_no: string;
    product_sales_total_c: string;
    office: string;
    date_ordered_c: string;
  };
}

const createShipLog = async (
  req: NextApiRequestWithSugarToken,
  res: NextApiResponse
) => {
  if (req.method !== "POST") {
    res.status(405).send("Method not allowed");
    return;
  } else {
    try {
      const accessToken = req.access_token;

      const orderContents = req.body.description;
      const tracking = req.body.name;
      const orderNumberWithoutFirstChar = req.body.order_no;
      const price = req.body.product_sales_total_c;
      const officeId = req.body.office;
      const date = req.body.date_ordered_c;

      console.log(req.body);

      const createLog = async () => {
        const payload = {
          order_no: orderNumberWithoutFirstChar,
        };

        const response = await fetch(`${SUGAR_BASE_URL}rest/v11/FS_Shipping/`, {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        return data.id;
      };

      const shipLogId = await createLog();

      const updateLog = async () => {
        const payload = {
          description: orderContents,
          name: tracking,
          product_sales_total_c: price,
          date_ordered_c: date,
        };

        const response = await fetch(
          `${SUGAR_BASE_URL}rest/v11/FS_Shipping/${shipLogId}`,
          {
            method: "put",
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(payload),
          }
        );

        const data = await response.json();
        console.log(data);

        return data.id;
      };

      const updatedLogId = await updateLog();

      const linkLogToOffice = async () => {
        if (!officeId) {
          return;
        } else {
          const payload = {
            module: "FS_Shipping",
            ids: [updatedLogId],
            link_name: "fs_shipping_accounts",
          };

          const response = await fetch(
            `${SUGAR_BASE_URL}rest/v11/Accounts/${officeId}/link`,
            {
              method: "post",
              headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                Authorization: `Bearer ${accessToken}`,
              },
              body: JSON.stringify(payload),
            }
          );

          const data = (await response.json()) as SugarOffice;

          return data;
        }
      };

      if (officeId == undefined || null) {
        res
          .status(404)
          .json({ message: "Couldn't link log to office! Office not found!" });
        return;
      } else {
        await linkLogToOffice();
      }
      res.status(201).json({ message: "Log created and linked!" });
    } catch (error) {
      res.status(500).json({ message: "Something went wrong!" });
    }
  }
};

export default sugarMiddleware(createShipLog);
