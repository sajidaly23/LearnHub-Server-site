import { Request, Response } from "express";
import { ChatMessage } from "../models/chatmodel";
import mongoose from "mongoose";

//  sendMessage controller
export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { receiverId, courseId, message } = req.body;
    const senderId = (req as any).user.id;

    const newMessage = await ChatMessage.create({
      sender: senderId,
      receiver: receiverId,
      course: courseId,
      message,
    });

    res.status(201).json(newMessage);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// getMessages controller
export const getMessages = async (req: Request, res: Response) => {
  try {
    const { courseId, userId } = req.params;
    const messages = await ChatMessage.find({
      course: new mongoose.Types.ObjectId(courseId),
      $or: [
        { sender: userId },
        { receiver: userId },
      ],
    }).sort({ createdAt: -1 });

    res.json(messages);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

//  getThreads controller
export const getThreads = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;
    const threads = await ChatMessage.aggregate([
      { $match: { course: new mongoose.Types.ObjectId(courseId) } },
      {
        $group: {
          _id: { sender: "$sender", receiver: "$receiver" },
          lastMessage: { $last: "$$ROOT" },
        },
      },
      { $sort: { "lastMessage.createdAt": -1 } },
    ]);

    res.json(threads);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
