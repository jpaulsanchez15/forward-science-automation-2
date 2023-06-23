import { type NextApiRequest, type NextApiResponse } from "next";
import { env } from "../../../../env.mjs";

import sugarMiddleware from "../middleware";
import type { SugarOffice } from "@/types/sugar/index";

const SUGAR_BASE_URL = env.SUGAR_BASE_URL;

type SugarOffices = {
  records: SugarOffice[];
};

interface NextApiRequestWithSugarToken extends NextApiRequest {
  access_token: string;
}

const findAspenOffice = async (
  req: NextApiRequestWithSugarToken,
  res: NextApiResponse
) => {
  if (req.method !== "GET") {
    res.status(405).send("Method not allowed");
    return;
  } else {
    const accessToken = req.access_token;
    const officeName =
      req.query.officeName !== "" ? req.query.officeName : null;

    const endpoint = `Accounts?filter[0][$or][1][name][$contains]=${
      officeName as string
    }`;

    const response = await fetch(`${SUGAR_BASE_URL}rest/v11/${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data: SugarOffices = (await response.json()) as SugarOffices;

    if (data.records.length === 0) {
      res.status(404).send("Office not found");
      return;
    } else {
      res.status(200).json(data.records);
      return;
    }
  }
};

export default sugarMiddleware(findAspenOffice);
