import mongoose from "mongoose";
import { trendingPostSchema } from "../models/trendingPost.model.js";

export default mongoose.model("editorpicks", trendingPostSchema);