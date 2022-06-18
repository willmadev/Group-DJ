import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import { searchSong } from "../../../lib/spotify";

const handler = nc<NextApiRequest, NextApiResponse>().get(async (req, res) => {
  if (!req.query.q) {
    res.status(400).json({ error: "no_query" });
    return;
  }
  const results = await searchSong(req.query.q.toString());
  res.status(200).json(results);
});

export default handler;
