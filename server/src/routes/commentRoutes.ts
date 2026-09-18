import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  addComment,
  getPostComments,
} from "../controllers/commentController.js";

const router = express.Router();

router.post("/:id", isAuthenticated, addComment);
router.get("/:id", isAuthenticated, getPostComments);

export default router;
