import type { Request, Response } from "express";
import User from "../models/userModel.js";
import { AppError } from "../utils/AppError.js";
import bcrypt from "bcryptjs";
import { uploadBufferToCloudinary } from "../utils/imageUpload.js";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
import {
  accessCookieOptions,
  createAccessToken,
  createRefreshToken,
  hashRefreshToken,
  refreshCookieOptions,
  refreshTokenExpiresAt,
  verifyRefreshToken,
} from "../utils/tokens.js";

export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  const user = await User.findOne({ email });
  if (user) {
    throw new AppError(400, "User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await User.create({
    username,
    email,
    password: hashedPassword,
  });

  res.status(201).json({ success: true, message: "User created successfully" });
};

const setAuthCookies = (res: Response, userId: string) => {
  const accessToken = createAccessToken(userId);
  const refreshToken = createRefreshToken(userId);

  res
    .cookie("accessToken", accessToken, accessCookieOptions())
    .cookie("refreshToken", refreshToken, refreshCookieOptions());

  return hashRefreshToken(refreshToken);
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new AppError(400, "Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new AppError(400, "Invalid email or password");
  }

  const refreshTokenHash = setAuthCookies(res, user._id.toString());
  await User.updateOne(
    { _id: user._id },
    {
      $set: {
        refreshTokenHash,
        refreshTokenExpiresAt: refreshTokenExpiresAt(),
      },
    },
  );

  res.status(200).json({ success: true, message: "Login successful" });
};

export const logout = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (refreshToken) {
    const refreshTokenHash = hashRefreshToken(refreshToken);
    await User.updateOne(
      { refreshTokenHash },
      { $unset: { refreshTokenHash: 1, refreshTokenExpiresAt: 1 } },
    );
  }

  res
    .clearCookie("accessToken", accessCookieOptions())
    .clearCookie("refreshToken", refreshCookieOptions())
    .clearCookie("token", { path: "/" })
    .status(200)
    .json({ success: true, message: "Logout successful" });
};

export const refresh = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) throw new AppError(401, "Refresh token is required");

  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch {
    throw new AppError(401, "Invalid refresh token");
  }

  if (decoded.type !== "refresh" || typeof decoded.id !== "string") {
    throw new AppError(401, "Invalid refresh token");
  }

  const refreshTokenHash = hashRefreshToken(refreshToken);
  const user = await User.findOne({
    _id: decoded.id,
    refreshTokenHash,
    refreshTokenExpiresAt: { $gt: new Date() },
  }).select("+refreshTokenHash +refreshTokenExpiresAt");

  if (!user) throw new AppError(401, "Invalid refresh token");

  const nextRefreshTokenHash = setAuthCookies(res, user._id.toString());
  user.refreshTokenHash = nextRefreshTokenHash;
  user.refreshTokenExpiresAt = refreshTokenExpiresAt();
  await user.save();

  res.status(200).json({ success: true, message: "Token refreshed" });
};

export const profile = async (req: Request, res: Response) => {
  const { id: userId } = req.user;

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(404, "User not found");
  }

  res.status(200).json({ success: true, user });
};

export const updateProfile = async (req: Request, res: Response) => {
  const { username, bio, gender } = req.body;
  const { id: userId } = req.user;

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(404, "User not found");
  }

  let profilePicture = user.profilePicture;
  let profilePicturePublicId = user.profilePicturePublicId;

  if (req.file && req.file?.buffer) {
    if (user.profilePicturePublicId) {
      try {
        await cloudinary.uploader.destroy(user.profilePicturePublicId);
      } catch (error) {
        console.log("Failed to delete old avatar from Cloudinary");
      }
    }

    const result = await uploadBufferToCloudinary(req.file.buffer, {
      folder: "Avatars",
      type: "avatar",
    });
    profilePicture = result.secure_url;
    profilePicturePublicId = result.public_id;
  }

  if (bio !== undefined) {
    user.bio = bio;
  }

  user.username = username || user.username;
  user.gender = gender || user.gender;
  user.profilePicture = profilePicture || user.profilePicture;
  user.profilePicturePublicId =
    profilePicturePublicId || user.profilePicturePublicId;

  await user.save();

  res
    .status(200)
    .json({ success: true, message: "Profile update successful", user });
};

export const checkAuth = async (req: Request, res: Response) => {
  const { id: userId } = req.user;

  const user = await User.findById(userId);
  if (!user) throw new AppError(404, "User not found");
  res.status(200).json({ success: true, user });
};

export const suggestedUsers = async (req: Request, res: Response) => {
  const { id: userId } = req.user;

  const suggestedUsers = await User.find({ _id: { $ne: userId } });
  if (!suggestedUsers.length) {
    return res.status(200).json({ success: true, suggestedUsers: [] });
  }

  res.status(200).json({ success: true, suggestedUsers });
};

export const follow = async (req: Request, res: Response) => {
  const { id: userId } = req.user;
  const { id } = req.params;

  if (typeof id !== "string" || !mongoose.isValidObjectId(id)) {
    throw new AppError(400, "Invalid user ID format");
  }

  if (userId === id) {
    throw new AppError(400, "You cannot follow yourself");
  }

  const user = await User.findById(userId);
  const targetUser = await User.findById(id);

  if (!user || !targetUser) {
    throw new AppError(404, "User not found");
  }

  const isFollowing = user.followings.find((followedId) =>
    followedId.equals(id),
  );
  if (isFollowing) {
    throw new AppError(400, "You are already following this user");
  }

  user.followings.push(new mongoose.Types.ObjectId(id));
  targetUser.followers.push(new mongoose.Types.ObjectId(userId));

  await Promise.all([user.save(), targetUser.save()]);

  res
    .status(200)
    .json({ success: true, message: "Followed successfully", user });
};

export const unfollow = async (req: Request, res: Response) => {
  const { id: userId } = req.user;
  const { id } = req.params;

  if (typeof id !== "string" || !mongoose.isValidObjectId(id)) {
    throw new AppError(400, "Invalid user ID format ");
  }

  if (userId === id) {
    throw new AppError(400, "You cannot unfollow yourself");
  }

  const user = await User.findById(userId);
  const targetUser = await User.findById(id);

  if (!user || !targetUser) {
    throw new AppError(404, "User not found");
  }

  const isFollowing = user.followings.find((followedId) =>
    followedId.equals(id),
  );
  if (!isFollowing) {
    throw new AppError(400, "You are not following this user");
  }

  user.followings = user.followings.filter(
    (followedId) => !followedId.equals(id),
  );
  targetUser.followers = targetUser.followers.filter(
    (followedId) => !followedId.equals(userId),
  );

  await Promise.all([user.save(), targetUser.save()]);

  res
    .status(200)
    .json({ success: true, message: "Unfollowed successfully", user });
};
