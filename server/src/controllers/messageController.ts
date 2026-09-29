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
