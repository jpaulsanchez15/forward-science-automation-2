import type { SugarAuth } from "@/types/sugar/index";
import { type NextApiRequest, type NextApiResponse } from "next";
import { env } from "../../../env.mjs";

const SUGAR_BASE_URL = env.SUGAR_BASE_URL;

interface NextApiRequestWithSugarToken extends NextApiRequest {
  access_token: string;
}

const sugarMiddleware = (
  handler: (
    req: NextApiRequestWithSugarToken,
    res: NextApiResponse
  ) =>
    | Promise<void>
    | string
    | undefined
    | Promise<"Not PPL" | undefined>
    | void
) => {
  return async (req: NextApiRequestWithSugarToken, res: NextApiResponse) => {
    try {
      const response: Response = await fetch(
        `${SUGAR_BASE_URL}rest/v11/oauth2/token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "x-requested-with , x-requested-by",
          },
          body: JSON.stringify({
            grant_type: "password",
            client_id: env.SUGAR_CLIENT_ID,
            client_secret: env.SUGAR_CLIENT_SECRET,
            username: env.SUGAR_USERNAME,
            password: env.SUGAR_PASSWORD,
            platform: "base",
          }),
        }
      );

      const data: SugarAuth = (await response.json()) as SugarAuth;

      const { access_token: accessToken } = data;

      req.access_token = accessToken;

      return handler(req, res);
    } catch (error) {
      res.status(500).send({ message: "Internal server error" });
    }
  };
};

export default sugarMiddleware;
