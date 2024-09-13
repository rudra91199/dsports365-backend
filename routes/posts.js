import epxress from "express";
import {
  createPost,
  getAllPosts,
  getNews,
  uploadImages,
} from "../controllers/post.controller.js";

const router = epxress.Router();

router.get("/all", getAllPosts);

router.post("/create", createPost);

router.get("/post/:id", getNews);

router.post("/image/upload", uploadImages);

export default router;
