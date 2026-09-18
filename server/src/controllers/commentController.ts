import type { Request, Response } from "express";
import mongoose from "mongoose";
import { AppError } from "../utils/AppError.js";
import Comment from "../models/commentModel.js";
import Post from "../models/postModel.js";

export const addComment = async (req: Request, res: Response) => {
  const { text } = req.body;
  const { id: userId } = req.user;
  const postId = req.params.id;

  if (
    typeof postId !== "string" ||
    !mongoose.isValidObjectId(postId) ||
    !text
  ) {
    throw new AppError(400, "Invalid post ID format or text is undefined");
  }

  const comment = await Comment.create({ text, author: userId, post: postId });

  const post = await Post.findById(postId);
  if (!post) {
    throw new AppError(404, "Post not found");
  }

  post.comments.push(comment._id);
  await post.save();

  res.status(201).json({ success: true, message: "Comment added", comment });
};

export const getPostComments = async (req: Request, res: Response) => {
  const postId = req.params.id;
  if (typeof postId !== "string" || !mongoose.isValidObjectId(postId)) {
    throw new AppError(400, "Invalid post ID format");
  }

  const comments = await Comment.find({ post: postId })
    .populate("author", "username profilePicture")
    .lean();

  if (!comments.length) {
    return res.status(200).json({ success: true, comments: [] });
  }

  res.status(200).json({ success: true, comments });
};
