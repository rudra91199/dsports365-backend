import mongoose from "mongoose";

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: Object,
    default: {
      url: "",
      public_id: "",
    },
  },
  role: {
    type: String,
    default: "pending",
  },
});

export default mongoose.model("authors", authorSchema);
