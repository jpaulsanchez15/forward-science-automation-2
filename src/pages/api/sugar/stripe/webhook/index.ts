import { type NextApiRequest, type NextApiResponse } from "next";
import { env } from "../../../../../env.mjs";

import sugarMiddleware from "../../middleware";

const SUGAR_BASE_URL = env.SUGAR_BASE_URL;

interface NextApiRequestWithSugarToken extends NextApiRequest {
  access_token: string;
}

interface Email {
  email_address: string;
}

const findStripeOffice = async (
  req: NextApiRequestWithSugarToken,
  res: NextApiResponse
) => {
  if (req.method !== "GET") {
    res.status(405).send("Method not allowed");
    return;
  } else {
    const accessToken = req.access_token;
    const queryEmail = req.query.email !== "" ? req.query.email : undefined;

    const endpoint = `Accounts?filter[0][email_addresses.email_address][$equals]=${
      queryEmail as string
    }`;

    const response = await fetch(`${SUGAR_BASE_URL}rest/v11/${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();
    const { email, id } = data.records[0] ?? [];
    const emailAddresses = email
      ?.map((email: Email) => {
        return email.email_address;
      })
      .join(", ");

    if (data?.records?.length === 0) {
      res.status(404).send({
        message:
          "Couldn't find Sugar office. Please look up in Sugar yourself.",
      });
      return;
    } else {
      res.status(200).json({ message: emailAddresses, id: id });
      return;
    }
  }
};

export default sugarMiddleware(findStripeOffice);
