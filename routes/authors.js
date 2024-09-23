import express from "express";
import {
  createAuthor,
  generateReferral,
  getAuthors,
  getToken,
  verifyReferral,
} from "../controllers/author.controller.js";
import verifyToken from "../middlewares/verifyToken.js";
import isAdmin from "../middlewares/isAdmin.js";

const router = express.Router();

router.get("/getAllAuthors", verifyToken, isAdmin, getAuthors)

router.post("/create_author", createAuthor);

router.post("/getToken", getToken);

router.post("/generateReferral", generateReferral);

router.get("/verifyReferral/:code", verifyReferral);

export default router;
