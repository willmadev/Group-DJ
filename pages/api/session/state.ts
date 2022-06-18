import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import { playTrack } from "../../../lib/spotify";

import Session from "../../../models/Session";

const handler = nc<NextApiRequest, NextApiResponse>().post(async (req, res) => {
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

  if (!req.body.status) {
    res.status(400).json({ error: "no_status" });
    return;
  }
  const status = req.body.status;

  if (status === "play_next") {
    console.log("state: Play next");
    if (!req.body.access_token) {
      res.status(400).json({ error: "no_access_token" });
      return;
    }
    const access_token = req.body.access_token;
    if (!req.body.device_id) {
      res.status(400).json({ error: "no_device_id" });
      return;
    }
    const device_id = req.body.device_id;
    if (session.currentTrack === session.queue.length - 1) {
      // queue over
      console.log("state: Queue over");
      session.state = "stopped";
      await session.save();
      res.status(204).send(null);
      return;
    } else {
      // play next song
      session.currentTrack += 1;
      const nextTrack = session.queue[session.currentTrack];
      const { uri } = nextTrack;
      console.log("state: Playing next song");
      playTrack(access_token, uri, device_id);

      session.state = "playing";
      await session.save();
      res.status(204).send(null);
      return;
    }
  }
});

export default handler;
