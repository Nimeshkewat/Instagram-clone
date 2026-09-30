import type { Request, Response } from "express";
import Conversation from "../models/conversationModel.js";
import mongoose from "mongoose";
import { AppError } from "../utils/AppError.js";
import Message from "../models/messageModel.js";
import { getIO } from "../socket.js";

export const sendMessage = async (req: Request, res: Response) => {
  const senderId = req.user.id;
  const receiverId = req.params.id;
  const { message } = req.body;

  if (typeof receiverId !== "string" || !mongoose.isValidObjectId(receiverId)) {
    throw new AppError(400, "Invalid ID format");
  }

  let conversation = await Conversation.findOne({
    participants: { $all: [senderId, receiverId] },
  });

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [senderId, receiverId],
    });
  }

  const newMessage = await Message.create({ senderId, receiverId, message });

  if (newMessage) {
    conversation?.messages.push(newMessage._id);
  }
  await Promise.all([conversation?.save(), newMessage.save()]);

  getIO().to(senderId).to(receiverId).emit("newMessage", newMessage);
  res.status(200).json({ success: true, newMessage });
};

export const getMessage = async (req: Request, res: Response) => {
  const senderId = req.user.id;
  const receiverId = req.params.id;

  if (typeof receiverId !== "string" || !mongoose.isValidObjectId(receiverId)) {
    throw new AppError(400, "Invalid ID format");
  }

  const conversation = await Conversation.findOne({
    participants: { $all: [senderId, receiverId] },
  }).populate("messages");

  if (!conversation) {
    return res.status(200).json({ success: true, messages: [] });
  }
  res.status(200).json({ success: true, messages: conversation.messages });
};

export const deleteMessage = async (req: Request, res: Response) => {
  const { id: senderId } = req.user;
  const { messageId } = req.params;

  if (typeof messageId !== "string" || !mongoose.isValidObjectId(messageId)) {
    throw new AppError(400, "Invalid message ID format");
  }

  const message = await Message.findOne({ _id: messageId, senderId });
  if (!message) {
    throw new AppError(404, "Message not found");
  }

  await Promise.all([
    Message.deleteOne({ _id: message._id }),
    Conversation.updateOne(
      { participants: { $all: [message.senderId, message.receiverId] } },
      { $pull: { messages: message._id } },
    ),
  ]);

  const deletedMessage = {
    messageId: message._id.toString(),
    senderId: message.senderId.toString(),
    receiverId: message.receiverId.toString(),
  };

  getIO()
    .to(deletedMessage.senderId)
    .to(deletedMessage.receiverId)
    .emit("messageDeleted", deletedMessage);

  res.status(200).json({ success: true, message: "Message deleted" });
};
