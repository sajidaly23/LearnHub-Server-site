// src/socket.ts
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { ChatMessage } from "../models/chatmodel";
import mongoose from "mongoose";

interface ServerToClientEvents {
  receiveMessage: (msg: any) => void;
}
interface ClientToServerEvents {
  joinRoom: (payload: { courseId: string }) => void;
  sendMessage: (payload: { receiverId: string; courseId: string; message: string }) => void;
}
interface InterServerEvents {}
interface SocketData { userId: string }

export const initSocket = (httpServer: any) => {
  const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(httpServer, {
    cors: { origin: "*", credentials: true },
  });

  // Simple auth via JWT in connection query (?token=...)
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    if (!token || Array.isArray(token)) return next(new Error("unauthorized"));
    try {
      const decoded = jwt.verify(String(token), process.env.JWT_SECRET as string) as any;
      socket.data.userId = decoded.id || decoded._id;
      return next();
    } catch {
      return next(new Error("unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.data.userId;
    // Optional: personal room for direct emits
    socket.join(`user:${userId}`);

    socket.on("joinRoom", ({ courseId }) => {
      socket.join(`course:${courseId}`);
    });

    socket.on("sendMessage", async ({ receiverId, courseId, message }) => {
      if (!receiverId || !courseId || !message?.trim()) return;

      const chat = await ChatMessage.create({
        sender: new mongoose.Types.ObjectId(userId),
        receiver: new mongoose.Types.ObjectId(receiverId),
        course: new mongoose.Types.ObjectId(courseId),
        message: message.trim(),
      });

      // Emit to everyone in that course room (both sides if joined)
      io.to(`course:${courseId}`).emit("receiveMessage", chat);
      // Also ensure receiver gets it even if not in course room
      io.to(`user:${receiverId}`).emit("receiveMessage", chat);
    });
  });

  return io;
};
