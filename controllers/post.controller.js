import formidable from "formidable";
import postModel from "../models/post.model.js";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "drdhz0kbo",
  api_key: "359426465337116",
  api_secret: "KuH4eG8Y0Lu_oNcIlDWgCWOWxCs",
  secure: true,
});

export const getNewsForUsers = async (req, res) => {
  const page = req.query.page;
  const limit = req.query.limit;
  const filter = {
    ...(req.query.category && { category: req.query.category }),
    ...(req.query.subcategory && { subcategory: req.query.subcategory }),
    ...(req.query.exclude === "সাক্ষাৎকার" && {
      category: { $ne: req.query.exclude },
    }),
  };
  try {
    const result = await postModel
      .find(filter)
      .skip(page * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .select(["-status", "-writer.email", "-updatedAt"]);
    const count = await postModel.countDocuments(filter);
    console.log(filter);
    return res.status(200).send({ result, count });
  } catch (error) {
    throw error;
  }
};

export const getAllPosts = async (req, res) => {
  const role = req?.userInfo?.role;
  const email = req?.userInfo?.email;
  console.log(role, email);
  try {
    if (role === "admin") {
      const result = await postModel.find().sort({ createdAt: -1 });
      return res.status(200).send(result);
    }
    if (role === "writer") {
      const result = await postModel
        .find({ "writer.email": email })
        .sort({ createdAt: -1 });
      return res.status(200).send(result);
    }
  } catch (error) {
    throw error;
  }
};

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

export const getNews = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await postModel.findById(id).sort({ createdAt: -1 });
    res.send(result);
  } catch (error) {
    throw error;
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
  try {
    const result = await postModel.findByIdAndUpdate(
      { _id: req.body.id },
      {
        $set: {
          status: req.body.status,
        },
      }
    );
    res.status(200).send({ message: "News Status Updated" });
  } catch (error) {
    throw error;
  }
};

export const getProductByQuery = async (req, res) => {
  const query = req.params;
  console.log(query);
  try {
    const result = await postModel.find({
      title: {
        $regex: query.search,
        $options: "i",
      },
    });
    res.status(200).send({ result });
  } catch (error) {
    console.log(error);
  }
};
