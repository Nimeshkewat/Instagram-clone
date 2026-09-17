import type { Request, Response } from "express";
import User from "../models/userModel.js";
import { AppError } from "../utils/AppError.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { CookieOptions } from "express";

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

  const user = await User.findOne({ email });
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
