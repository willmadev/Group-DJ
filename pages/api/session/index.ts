import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";

import connectMongo from "../../../lib/dbConn";
import Session from "../../../models/Session";

const handler = nc<NextApiRequest, NextApiResponse>()
  // Create Session
  .post(async (req, res) => {
    connectMongo();
    // create session code
    let sessionCode = Math.floor(100000 + Math.random() * 900000);
    while (!(await Session.find({ code: sessionCode }))) {
      sessionCode = Math.floor(100000 + Math.random() * 900000);
    }

    // insert into db
    const session = await Session.create({ code: sessionCode });

    // return code and redirect user
    res.status(200).json(session);
    return;
  })
  .get(async (req, res) => {
    connectMongo();
    const sessionCode = req.query.sessionCode;

    if (!sessionCode) {
      res.status(400).json({ error: "no_session_code" });
      return;
    }

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

    const result = {
      sessionCode,
      queue: session.queue,
      participants: session.participants,
      currentTrack: session.currentTrack,
      state: session.state,
    };
    res.status(200).json(result);
    return;
  })
  .put(async (req, res) => {
    connectMongo();
    if (!req.body.sessionCode) {
      res.status(400).json({ error: "no_session_code" });
      return;
    }
    if (!req.body.user) {
      res.status(400).json({ error: "no_user" });
      return;
    }
    if (!req.body.title) {
      res.status(400).json({ error: "no_title" });
      return;
    }
    if (!req.body.artist) {
      res.status(400).json({ error: "no_artist" });
      return;
    }
    if (!req.body.uri) {
      res.status(400).json({ error: "no_uri" });
      return;
    }
    const { sessionCode, user, title, artist, uri } = req.body;

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

    session.queue.push({
      title,
      artist,
      user,
      uri,
    });

    try {
      await session.save();
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "internal_server_error" });
      return;
    }
    res.status(204).send(null);
    return;
  });

export default handler;
