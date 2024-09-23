import mongoose from "mongoose";

const referralSchema = new mongoose.Schema(
  {
    referralCode: {
      type: Number,
    },
    expiresAt: {
      type: Date,
    },
    createdAt: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("referrals", referralSchema);
