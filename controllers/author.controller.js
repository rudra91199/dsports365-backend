import authorModel from "../models/author.model.js";
import jwt from "jsonwebtoken";
import bcript from "bcrypt";
import referralsModel from "../models/referrals.model.js";
import postModel from "../models/post.model.js";
import cloudinary from "../config/cloudinary.js";

export const getAuthors = async (req, res) => {
  try {
    const result = await authorModel.find();
    const count = await authorModel.countDocuments();
    return res.status(201).send({ result, count });
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

export const getProfileDetails = async (req, res) => {
  const email = req.params.email;
  const requestedEmail = req?.userInfo?.email;
  if (email === requestedEmail) {
    const result = await authorModel.findOne({ email: email });
    return res.status(200).send(result);
  } else {
    return res.status(403).send({ message: "Forbidden Access." });
  }
};

export const handleAuthorRole = async (req, res) => {
  try {
    const result = await authorModel.findByIdAndUpdate(
      { _id: req.body.id },
      {
        $set: {
          role: req.body.role,
        },
      }
    );
    res.status(200).send({ message: "Author role Updated" });
  } catch (error) {}
};

export const updateProfile = async (req, res) => {
  const body = req.body;
  const email = req.params.email;
  const requesterEmail = req?.userInfo?.email;
  try {
    if (requesterEmail === email) {
      let newImage = req.body.oldImage;
      if (body.image.length > 0) {
        if (body.oldImage.public_id) {
          await cloudinary.uploader.destroy(body.oldImage.public_id);
        }
        const { url, public_id } = await cloudinary.uploader.upload(
          body.image,
          {
            upload_preset: "Authors_Images",
            transformation: [{ quality: "auto" }, { fetch_format: "auto" }],
          }
        );
        newImage.url = url;
        newImage.public_id = public_id;
      }
      const { oldImage, ...bodyData } = body;
      const updatedData = { ...bodyData, image: newImage };
      const result = await authorModel.updateOne(
        { email: email },
        updatedData,
        {
          new: true,
        }
      );
      if (result.modifiedCount === 1) {
        const updateNews = await postModel.updateMany(
          { "writer.email": email },
          {
            $set: {
              "writer.name": body.name,
              "writer.image": newImage.url,
            },
          },
          { new: true }
        );
      }
      return res.status(200).send({ message: "Profile Updated", result });
    } else {
      return res.status(403).send({ message: "Forbidden Access." });
    }
  } catch (error) {
    return res.status(500).send({ message: "Internal server error" });
  }
};
