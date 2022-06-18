import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";

import { getTokens } from "../../../../lib/spotify";

type Data =
  | {
      error: boolean;
      expires_in?: undefined;
      access_token?: undefined;
      refresh_token?: undefined;
    }
  | {
      expires_in: number;
      access_token: string;
      refresh_token: string;
      error?: undefined;
    }
  | String;

const handler = nc()
  // auth middleware
  // .use()
  .get<NextApiRequest, NextApiResponse<Data>>(async (req, res) => {
    const { code } = req.query;

    if (typeof code !== "string" || Array.isArray(code)) {
      res.status(400).send("Error: Invalid Code");
      return;
    }

    const result = await getTokens(code as string);
    if (result.error) {
      res.status(500).send("Error");
      return;
    }

    res.status(200).json(result);
    return;
  });
export default handler;
