import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";

import connectMongo from "../../../lib/dbConn";
import Session from "../../../models/Session";

const handler = nc<NextApiRequest, NextApiResponse>().post(async (req, res) => {
  connectMongo();

  // validate data
  if (!req.body.name) {
    res.status(400).json({ error: "no_name" });
    return;
  }
  const name = req.body.name as string;
  if (!req.body.sessionCode) {
    res.status(400).json({ error: "no_session_code" });
    return;
  }
  const sessionCode = req.body.sessionCode as string;

  let session;
  try {
    session = await Session.findOne({ code: sessionCode });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "internal_server_error" });
    return;
  }

  if (!session) {
    res.status(400).json({ error: "session_not_found" });
    return;
  }

  session.participants.push(name);
  try {
    await session.save();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "internal_server_error" });
    return;
  }

  res.status(200).json(session);
});

export default handler;
