import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    writer: {
      type: Object,
      required: true,
    },
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
      default: "",
    },
    slogan: {
      type: String,
      default: "",
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
