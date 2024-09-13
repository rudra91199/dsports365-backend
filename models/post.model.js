import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    subcategory: {
      type: String,
      required: true,
    },
    slogan: {
      type: String,
    },
    image: {
      type: Object,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
    },
    count: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("posts", postSchema);
