import type { Request, Response } from "express";
import User from "../models/userModel.js";
import { AppError } from "../utils/AppError.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { CookieOptions } from "express";
import { uploadBufferToCloudinary } from "../utils/imageUpload.js";
import { v2 as cloudinary } from "cloudinary";

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

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("password");
  if (!user) {
    throw new AppError(400, "Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new AppError(400, "Invalid email or password");
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string);
  const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  res
    .cookie("token", token, cookieOptions)
    .status(200)
    .json({ success: true, message: "Login successful" });
};

export const logout = async (req: Request, res: Response) => {
  res
    .clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    })
    .status(200)
    .json({ success: true, message: "Logout successful" });
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

    const result = await uploadBufferToCloudinary(req.file.buffer, "Avatars");
    profilePicture = result.secure_url;
    profilePicturePublicId = result.public_id;
  }

  user.username = username || user.username;
  user.bio = bio || user.bio;
  user.gender = gender || user.gender;
  user.profilePicture = profilePicture || user.profilePicture;
  user.profilePicturePublicId =
    profilePicturePublicId || user.profilePicturePublicId;

  await user.save();

  res
    .status(200)
    .json({ success: true, message: "Profile update successful", user });
};
