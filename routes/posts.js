import epxress from "express";
import { isWriter } from "../middlewares/verifyRole.js";
import verifyToken from "../middlewares/verifyToken.js";
import isAdmin from "../middlewares/isAdmin.js";
import {
  createPost,
  deletePost,
  getAllPosts,
  getSingleNews,
  handleStatus,
  updateNews,
  uploadImages,
} from "../controllers/post.AdminController.js";
import {
  getEditorialNews,
  getNewsByid,
  getNewsForUsers,
  getProductByQuery,
  newsCountByCategory,
  popularNews,
  updateCount,
} from "../controllers/post.controller.js";
import {
  getTrendingPost,
  updateTrendings,
} from "../controllers/trendingPost.controller.js";
import {
  getEditorPicks,
  updateEditorPicks,
} from "../controllers/editorPicks.controller.js";

const router = epxress.Router();

//for frontend

router.get("/allNews", getNewsForUsers);

router.get("/getSingleNews", getNewsByid);

router.put("/updateCount", updateCount);

router.get("/getNewsCountByCategory", newsCountByCategory);

router.get("/getPopularNews", popularNews);

router.get("/getProductByQuery/:search", getProductByQuery);

router.get("/getEditorialNews", getEditorialNews);

//for admin panel

router.get("/all", verifyToken, getAllPosts);

router.post("/create", createPost);

router.post("/image/upload", uploadImages);

router.put("/update/:id", updateNews);

router.get("/getSingleNewsById", verifyToken, getSingleNews);

router.put("/update/status/:email", verifyToken, handleStatus);

router.delete("/delete", verifyToken, isAdmin, deletePost);

// trending news

router.get("/trendingNews", getTrendingPost);

router.put("/trending/update", verifyToken, isAdmin, updateTrendings);

// editor picks

router.get("/editorPicks", getEditorPicks);

router.put("/editorPicks/update", updateEditorPicks);

export default router;
