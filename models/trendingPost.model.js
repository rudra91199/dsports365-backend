import mongoose from "mongoose";

export const trendingPostSchema = new mongoose.Schema(
  {
    index: {
      type: Number,
      required: true,
    },
    post: {
      type: Object,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("trendingnews", trendingPostSchema);
