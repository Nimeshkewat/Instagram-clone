import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  addComment,
  deleteComment,
  getPostComments,
} from "../controllers/commentController.js";

const router = express.Router();

router.post("/:id", isAuthenticated, addComment);
router.get("/:id", isAuthenticated, getPostComments);
router.delete("/:id", isAuthenticated, deleteComment);

export default router;
