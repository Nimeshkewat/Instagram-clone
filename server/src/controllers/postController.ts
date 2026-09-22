import type { Request, Response } from "express";
import User from "../models/userModel.js";
import { AppError } from "../utils/AppError.js";
import { uploadBufferToCloudinary } from "../utils/imageUpload.js";
import Post from "../models/postModel.js";
import mongoose from "mongoose";
import Comment from "../models/commentModel.js";
import { v2 as cloudinary } from "cloudinary";

export const createPost = async (req: Request, res: Response) => {
  const { id: userId } = req.user;
  const { caption } = req.body;

  if (!req.file?.buffer) {
    throw new AppError(400, "Image is required");
  }

  const result = await uploadBufferToCloudinary(req.file.buffer, {
    folder: "Posts",
    type: "post",
  });
  let image = result.secure_url;
  let imagePublicId = result.public_id;

  const post = await Post.create({
    image,
    imagePublicId,
    caption,
    author: userId,
  });

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(404, "User not found");
  }

  user.posts.push(post._id);
  await user.save();

  res.status(201).json({ success: true, message: "New post created", post });
};

export const getPosts = async (req: Request, res: Response) => {
  const { id: userId } = req.user;

  const posts = await Post.find({ author: userId })
    .populate("author", "username  profilePicture")
    .populate({
      path: "comments",
      select: "text author",
      populate: {
        path: "author",
        select: "username profilePicture",
      },
    })
    .sort({ createdAt: -1 })
    .lean();

  if (!posts.length) {
    return res.status(200).json({ success: true, posts: [] });
  }

  res.status(200).json({ success: true, posts });
};

export const deletePost = async (req: Request, res: Response) => {
  const { id: userId } = req.user;
  const postId = req.params.id;

  if (typeof postId !== "string" || !mongoose.isValidObjectId(postId)) {
    throw new AppError(400, "Invalid post ID format");
  }

  const post = await Post.findOneAndDelete({ author: userId, _id: postId });
  if (!post) {
    throw new AppError(404, "Post not found");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(404, "User not found");
  }

  if (post.imagePublicId) {
    try {
      await cloudinary.uploader.destroy(post.imagePublicId);
    } catch (error) {
      console.log("Failed to delete old post from cloudinary");
    }
  }
  user.posts = user.posts.filter((id) => !id.equals(postId));
  await user.save();

  await Comment.deleteMany({ post: postId });

  res.status(200).json({ success: true, message: "Post deleted" });
};

export const likePost = async (req: Request, res: Response) => {
  const { id: UserId } = req.user;
  const postId = req.params.id;

  if (typeof postId !== "string" || !mongoose.isValidObjectId(postId)) {
    throw new AppError(400, "Invalid post ID format");
  }

  const post = await Post.findById(postId);
  if (!post) {
    throw new AppError(404, "Post not found");
  }

  await post.updateOne({ $addToSet: { likes: UserId } });

  res.status(200).json({ success: true, message: "Post liked" });
};

export const dislikePost = async (req: Request, res: Response) => {
  const { id: UserId } = req.user;
  const postId = req.params.id;

  if (typeof postId !== "string" || !mongoose.isValidObjectId(postId)) {
    throw new AppError(400, "Invalid post ID format");
  }

  const post = await Post.findById(postId);
  if (!post) {
    throw new AppError(404, "Post not found");
  }

  await post.updateOne({ $pull: { likes: UserId } });

  res.status(200).json({ success: true, message: "Post disliked" });
};

export const bookmarkPost = async (req: Request, res: Response) => {
  const { id: userId } = req.user;
  const postId = req.params.id;
  if (typeof postId !== "string" || !mongoose.isValidObjectId(postId)) {
    throw new AppError(400, "Invalid post ID format");
  }

  const post = await Post.findById(postId);
  if (!post) {
    throw new AppError(404, "Post not found");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(404, "User not found");
  }

  const existingBookmark = user.bookmarks.find((bookmark) =>
    bookmark.equals(postId),
  );

  if (existingBookmark) {
    await user.updateOne({ $pull: { bookmarks: post._id } });
    res.status(200).json({ success: true, message: "unsaved" });
  } else {
    await user.updateOne({ $addToSet: { bookmarks: post._id } });
    res.status(200).json({ success: true, message: "saved" });
  }
};
