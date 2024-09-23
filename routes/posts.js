import epxress from "express";
import {
  createPost,
  getAllPosts,
  getNews,
  getNewsForUsers,
  getProductByQuery,
  handleStatus,
  updateNews,
  uploadImages,
} from "../controllers/post.controller.js";
import { isWriter } from "../middlewares/verifyRole.js";
import verifyToken from "../middlewares/verifyToken.js";
import isAdmin from "../middlewares/isAdmin.js";

const router = epxress.Router();

router.get("/all", verifyToken, getAllPosts);

router.get("/allNews", getNewsForUsers);

router.post("/create", createPost);

router.get("/post/:id", getNews);

router.post("/image/upload", uploadImages);

router.put("/update/:id", updateNews);

router.put("/update/status/:email", verifyToken, isAdmin, handleStatus);

router.get("/getProductByQuery/:search", getProductByQuery);

export default router;
