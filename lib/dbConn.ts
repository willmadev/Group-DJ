import mongoose from "mongoose";
import { MONGO_URI } from "./config";

const connectMongo = async () => mongoose.connect(MONGO_URI);

export default connectMongo;
