import authorModel from "../models/author.model.js";
import jwt from "jsonwebtoken";
import bcript from "bcrypt";
import referralsModel from "../models/referrals.model.js";

export const getAuthors = async (req, res) => {
  try {
    const result = await authorModel.find();
    return res.status(201).send(result);
  } catch (error) {
    throw error;
  }
};

export const getToken = async (req, res) => {
  const isExists = await authorModel.findOne({ email: req.body.email });
  if (!isExists) {
    return res.status(404).json({ message: "User not found." });
  }
  if (isExists.role === "pending") {
    return res.status(401).json({ message: "Unauthorized access." });
  }
  if (
    isExists.role === "admin" ||
    isExists.role === "writer" ||
    isExists.role === "moderator"
  ) {
    const token = jwt.sign(
      {
        id: isExists.id,
        name: isExists.name,
        role: isExists.role,
        email: isExists.email,
        image: isExists.image,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    return res.status(200).json({ token });
  }
};

export const createAuthor = async (req, res) => {
  const body = new authorModel(req.body);
  try {
    const result = await body.save();
    if (result) {
      await referralsModel.deleteMany();
    }
    return res
      .status(201)
      .json({ message: "Your account has been successfully created." });
  } catch (error) {
    return res.status(501).json({ message: "failed to create account." });
  }
};

export const generateReferral = async (req, res) => {
  const isExists = await referralsModel.find().countDocuments();
  if (isExists > 0) {
    await referralsModel.deleteMany();
  }
  const referralCode = `${Math.floor(1000 + Math.random() * 9000)}`;
  const body = new referralsModel({
    referralCode,
    createdAt: Date.now(),
    expiresAt: Date.now() + 3600000,
  });
  const result = await body.save();
  res.send(result);
};

export const verifyReferral = async (req, res) => {
  const isExists = await referralsModel.findOne({
    referralCode: req.params.code,
  });
  if (isExists) {
    if (Date.now() > isExists.expiresAt) {
      await referralsModel.deleteMany();
      return res.status(400).json({ message: "Referral expired." });
    } else {
      return res.status(200).json({ message: "referral verified" });
    }
  } else {
    return res.status(404).json({ message: "referral not found" });
  }
};
