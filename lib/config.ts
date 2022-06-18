import dotenv from "dotenv";
dotenv.config();

export const NODE_ENV = process.env.NODE_ENV;

export const MONGO_URI = process.env.MONGO_URI || "";

export const SPOTIFY_ID = process.env.SPOTIFY_ID || "";
export const SPOTIFY_SECRET = process.env.SPOTIFY_SECRET || "";

const dev_url = "http://localhost:3000";
const prod_url = "https://groupdj.willma.me";

// export const URL = prod_url;
export const URL = NODE_ENV === "development" ? dev_url : prod_url;
