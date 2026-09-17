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
  following: mongoose.Types.ObjectId[];
  post: mongoose.Types.ObjectId[];
  bookmarks: mongoose.Types.ObjectId[];
}

const userSchmea = new mongoose.Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    profilePicture: { type: String, default: "" },
    profilePicturePublicId: { type: String, default: "" },
    bio: { type: String, default: "" },
    gender: { type: String, enum: ["male", "female"] },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    post: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  },
  { timestamps: true },
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchmea);
export default User;
