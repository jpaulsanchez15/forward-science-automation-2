import { type NextApiRequest, type NextApiResponse } from "next";
import { env } from "../../../../env.mjs";

import type { SugarOffice } from "@/types/sugar";
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
    ambassador: boolean;
  };
}

const date = new Date();
date.toISOString();

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

      const orderContents: string = req.body.description;
      const tracking: string = req.body.name;
      const orderNumberWithoutFirstChar: string = req.body.order_no;
      const price: string = req.body.product_sales_total_c;
      const officeId: string = req.body.office;

      const ambassador: boolean = req.body.ambassador;

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

        const { id } = (await response.json()) as { id: string };

        return id;
      };

      const shipLogId = await createLog();

      const updateLog = async () => {
        const payload = {
          description: orderContents,
          name: tracking.toString(),
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

        const { id } = (await response.json()) as { id: string };

        return id;
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

      const createFollowUpTask = async () => {
        // only on PPL
        const payload = {
          name: `FU Shopify Order ${orderNumberWithoutFirstChar}`,
          description: `${orderContents} \n $${price}`, // idfl discount yea or nah
          date_due: date,
          assigned_user_id: "6ef19564-2a62-4637-aace-d02fec4a7be4",
          // For some reason has to be a string, not var
          // const jps = "583fe47e-cd7d-4db1-8789-fcae7355f548";
          // const cd = "6ef19564-2a62-4637-aace-d02fec4a7be4"
          parent_id: officeId,
        };

        const response = await fetch(`${SUGAR_BASE_URL}rest/v11/Tasks/`, {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(payload),
        });

        const { id } = (await response.json()) as { id: string };

        return id;
      };

      const linkFollowUpTaskToOffice = async (id: string) => {
        const payload = {
          module: "Accounts",
          ids: [officeId],
          link_name: "accounts",
        };

        const response = await fetch(
          `${SUGAR_BASE_URL}rest/v11/Tasks/${id}/link`,
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

        const data = (await response.json()) as unknown;

        return data;
      };

      const PPL = [
        "TheraStom 6 pk",
        "OxiStom 6 pk",
        // Need the extra space between SM and 10, for some reason it doesn't accept it
        // without the space
        "SalivaMAX®  10 pk of 30 ct boxes",
        "[Pre-Order] BioStom™ 10 pk",
        "GelGauze™",
        "Extraction Package",
      ];

      if (!ambassador) {
        if (
          PPL.some(
            (product) =>
              orderContents.includes(product) && officeId === "No office found"
          )
        ) {
          await createFollowUpTask();
        } else if (
          PPL.some(
            (product) =>
              orderContents.includes(product) && officeId !== "No office found"
          )
        ) {
          const id = await createFollowUpTask();
          await linkFollowUpTaskToOffice(id);
        } else {
          return "Not PPL";
        }
      }

      res.status(201).json({ message: "Log created!" });
      return;
    } catch (error) {
      res.status(500).json({ message: "Something went wrong!" });
      return;
    }
  }
};

export default sugarMiddleware(createShipLog);
