import mongoose from "mongoose";
import type { Document, Model } from "mongoose";

interface IMessage extends Document {
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  message: string;
}

const messageSchema = new mongoose.Schema<IMessage>(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    message: { type: String, required: true },
  },
  { timestamps: true },
);

const Message: Model<IMessage> =
  mongoose.models.Message || mongoose.model("Message", messageSchema);
export default Message;
