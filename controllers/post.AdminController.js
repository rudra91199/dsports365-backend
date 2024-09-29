import formidable from "formidable";
import postModel from "../models/post.model.js";
import cloudinary from "../config/cloudinary.js";

export const createPost = async (req, res) => {
  const body = req.body;
  try {
    const { url, public_id } = await cloudinary.uploader.upload(
      req.body.image,
      {
        upload_preset: "news_images",
        transformation: [{ quality: "auto" }, { fetch_format: "auto" }],
      }
    );
    const newsData = { ...body, image: { url, public_id } };
    const newsBody = new postModel(newsData);
    const result = await newsBody.save();
    return res.status(200).json({ message: "News added successfully." });
  } catch (error) {
    return res.status(501).Json({ message: "Failed to add news." });
  }
};

export const getAllPosts = async (req, res) => {
  const role = req?.userInfo?.role;
  const email = req?.userInfo?.email;
  const page = req.query?.page;
  const limit = req.query?.limit;
  const filter = {
    ...(req.query.status && { status: req.query.status }),
    ...(req.query.search && {
      title: {
        $regex: req.query.search,
        $options: "i",
      },
    }),
  };

  try {
    if (role === "admin" || role === "moderator") {
      const news = await postModel
        .find(filter)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 });
      const count = await postModel.countDocuments(filter);
      return res.status(200).send({ news, count });
    }
    if (role === "writer") {
      const news = await postModel
        .find({ "writer.email": email, ...filter })
        .sort({ createdAt: -1 });
      const count = await postModel.countDocuments({
        "writer.email": email,
        ...filter,
      });
      return res.status(200).send({ news, count });
    }
  } catch (error) {
    throw error;
  }
};

export const getSingleNews = async (req, res) => {
  const RequestedEmail = req.query.email;
  const varifiedEmail = req?.userInfo?.email;
  const id = req.query.id;
  if (RequestedEmail === varifiedEmail) {
    const result = await postModel.findById(id);
    return res.status(201).send({ result });
  } else {
    return res.status(401).send({ message: "Access Denied" });
  }
};

export const uploadImages = async (req, res) => {
  const form = formidable({});
  try {
    const [_, files] = await form.parse(req);
    let allImage = [];
    const { images } = files;
    for (let i = 0; i < images.length; i++) {
      const { url, public_id } = await cloudinary.uploader.upload(
        images[i].filepath,
        {
          upload_preset: "news_images",
          transformation: [{ quality: "auto" }, { fetch_format: "auto" }],
        }
      );
      allImage.push({ url, public_id });
    }
    return res
      .status(201)
      .json({ images: allImage, message: "images added successfully." });
  } catch (error) {
    return res
      .status(501)
      .json({ images: allImage, message: "Failed to add images." });
  }
};

export const updateNews = async (req, res) => {
  const id = req.params.id;
  const body = req.body;
  try {
    let newImage = req.body.oldImage;
    if (body.image.length > 0) {
      await cloudinary.uploader.destroy(body.oldImage.public_id);
      const { url, public_id } = await cloudinary.uploader.upload(body.image, {
        upload_preset: "news_images",
        transformation: [{ quality: "auto" }, { fetch_format: "auto" }],
      });
      newImage.url = url;
      newImage.public_id = public_id;
    }
    const { oldImage, ...bodyData } = body;
    const updatedNews = { ...bodyData, image: newImage };
    const result = await postModel.findByIdAndUpdate(id, updatedNews, {
      new: true,
    });
    return res
      .status(200)
      .json({ message: "News updated successfully.", result });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const handleStatus = async (req, res) => {
  console.log(req?.userInfo, req.params.email);
  const role = req?.userInfo?.role;
  try {
    if (role === "admin" || role === "moderator") {
      const result = await postModel.findByIdAndUpdate(
        { _id: req.body.id },
        {
          $set: {
            status: req.body.status,
          },
        }
      );
      res.status(200).send({ message: "News Status Updated" });
    }
  } catch (error) {
    throw error;
  }
};

export const deletePost = async (req, res) => {
  const id = req.body.id;
  const public_id = req.body.public_id;
  try {
    cloudinary.uploader.destroy(public_id);
    const result = await postModel.findByIdAndDelete(id);
    return res.status(201).send({ message: "Post deleted." });
  } catch (error) {
    return res.status(400).send({ message: "Failed to Delete." });
  }
};
