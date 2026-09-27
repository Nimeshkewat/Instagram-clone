import express from "express";
import {
  bookmarkPost,
  createPost,
  deletePost,
  dislikePost,
  getBookmarkPosts,
  getFeedPosts,
  getPosts,
  likePost,
} from "../controllers/postController.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router();

router.post("/", isAuthenticated, upload.single("profilePicture"), createPost);
router.get("/feed", isAuthenticated, getFeedPosts);
router.get("/", isAuthenticated, getPosts);
router.delete("/:id", isAuthenticated, deletePost);

router.patch("/:id/like", isAuthenticated, likePost);
router.patch("/:id/dislike", isAuthenticated, dislikePost);

router.patch("/:id/bookmark", isAuthenticated, bookmarkPost);
router.get("/bookmark", isAuthenticated, getBookmarkPosts);

export default router;
