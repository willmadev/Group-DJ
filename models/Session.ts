import { model, models, Schema } from "mongoose";

const SongSchema = new Schema({
  title: String,
  artist: String,
  user: String,
  uri: String,
});

const SessionSchema = new Schema({
  code: {
    type: Number,
    required: true,
    unique: true,
  },
  queue: [SongSchema],
  currentTrack: {
    type: Number,
    default: -1,
  },
  participants: [String],
  state: {
    type: String,
    default: "stopped",
  },
});

const Session = models.Session || model("Session", SessionSchema);

export default Session;
