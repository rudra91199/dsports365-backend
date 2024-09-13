import formidable from "formidable";
import postModel from "../models/post.model.js";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "drdhz0kbo",
  api_key: "359426465337116",
  api_secret: "KuH4eG8Y0Lu_oNcIlDWgCWOWxCs",
  secure: true,
});

export const getAllPosts = async (req, res) => {
  try {
  const result = await postModel.find()
  res.send(result);  
  } catch (error) {
    throw error
  }
}

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
    const result = await postModel.findById(id);
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
