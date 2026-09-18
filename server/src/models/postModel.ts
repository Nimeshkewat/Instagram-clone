import mongoose from "mongoose";
import type { Document, Model } from "mongoose";

interface IPost extends Document {
  image: string;
  imagePublicId: string;
  caption: string;
  likes: mongoose.Types.ObjectId[];
  comments: mongoose.Types.ObjectId[];
  author: mongoose.Types.ObjectId;
}

const postSchmea = new mongoose.Schema<IPost>(
  {
    image: { type: String, required: true, default: "" },
    imagePublicId: { type: String, default: "" },
    caption: {
      type: String,
      default: "",
      trim: true,
      maxLength: [1000, "Caption cannot exceed 1000 characters"],
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

const Post: Model<IPost> =
  mongoose.models.Post || mongoose.model<IPost>("Post", postSchmea);
export default Post;
