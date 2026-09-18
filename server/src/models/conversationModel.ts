import mongoose from "mongoose";
import type { Document, Model } from "mongoose";

interface IConversation extends Document {
  participants: mongoose.Types.ObjectId[];
  messages: mongoose.Types.ObjectId[];
}

const conversationSchema = new mongoose.Schema<IConversation>(
  {
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
  },
  { timestamps: true },
);

const Conversation: Model<IConversation> =
  mongoose.models.Conversation ||
  mongoose.model("Conversation", conversationSchema);
export default Conversation;
