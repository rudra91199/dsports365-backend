import epxress from "express";
import { isWriter } from "../middlewares/verifyRole.js";
import verifyToken from "../middlewares/verifyToken.js";
import isAdmin from "../middlewares/isAdmin.js";
import {
  createPost,
  getAllPosts,
  handleStatus,
  updateNews,
  uploadImages,
} from "../controllers/post.AdminController.js";
import {
  getNewsByid,
  getNewsForUsers,
  getProductByQuery,
  newsCountByCategory,
  popularNews,
  updateCount,
} from "../controllers/post.controller.js";

const router = epxress.Router();

router.get("/all", verifyToken, getAllPosts);

router.get("/allNews", getNewsForUsers);

router.post("/create", createPost);

router.post("/image/upload", uploadImages);

router.put("/update/:id", updateNews);

router.put("/update/status/:email", verifyToken, isAdmin, handleStatus);

router.get("/getProductByQuery/:search", getProductByQuery);

router.get("/getSingleNews", getNewsByid);

router.put("/updateCount", updateCount);

router.get("/getNewsCountByCategory", newsCountByCategory);

router.get("/getPopularNews", popularNews)

export default router;
