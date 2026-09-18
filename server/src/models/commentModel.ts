import mongoose from "mongoose";
import type { Document, Model } from "mongoose";

interface IComment extends Document {
  text: string;
  author: mongoose.Types.ObjectId;
  post: mongoose.Types.ObjectId;
}

const commentSchema = new mongoose.Schema<IComment>(
  {
    text: { type: String, required: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  },
  { timestamps: true },
);

const Comment: Model<IComment> =
  mongoose.models.Comment || mongoose.model("Comment", commentSchema);
export default Comment;
