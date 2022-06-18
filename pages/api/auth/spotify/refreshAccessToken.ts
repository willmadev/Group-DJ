import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import { refreshToken } from "../../../../lib/spotify";

const handler = nc().post<NextApiRequest, NextApiResponse>(async (req, res) => {
  if (!req.body.refresh_token || typeof req.body.refresh_token !== "string") {
    res.status(400).send("Error: Invali refresh token");
    return;
  }

  const tokens = await refreshToken(req.body.refresh_token);
  res.status(200).json(tokens);
  return;
});

export default handler;
