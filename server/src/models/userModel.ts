import mongoose from "mongoose";
import type { Document, Model } from "mongoose";

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  profilePicture: string;
  profilePicturePublicId: string;
  bio: string;
  gender: "male" | "female";
  followers: mongoose.Types.ObjectId[];
  followings: mongoose.Types.ObjectId[];
  posts: mongoose.Types.ObjectId[];
  bookmarks: mongoose.Types.ObjectId[];
}

const userSchmea = new mongoose.Schema<IUser>(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    profilePicture: { type: String, default: "" },
    profilePicturePublicId: { type: String, default: "" },
    bio: {
      type: String,
      default: "",
      maxLength: [120, "Bio must be less than 120 characters"],
    },
    gender: { type: String, enum: ["male", "female"] },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    followings: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  },
  { timestamps: true },
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchmea);
export default User;
