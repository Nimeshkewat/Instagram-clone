import type { Server as HttpServer } from "node:http";
import { Server } from "socket.io";
import { verifyAccessToken } from "./utils/tokens.js";

let io: Server | undefined;
const userSockets = new Map<string, Set<string>>();

const broadcastOnlineUsers = () => {
  io?.emit("onlineUsers", [...userSockets.keys()]);
};

export const initializeSocket = (httpServer: HttpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const cookieHeader = socket.handshake.headers.cookie;
    const cookies = Array.isArray(cookieHeader)
      ? cookieHeader.join("; ")
      : (cookieHeader ?? "");
    const accessToken = cookies
      .split(";")
      .map((cookie) => cookie.trim())
      .find((cookie) => cookie.startsWith("accessToken="))
      ?.slice("accessToken=".length);

    if (!accessToken) {
      next(new Error("Not authorized"));
      return;
    }

    try {
      const decoded = verifyAccessToken(decodeURIComponent(accessToken));
      if (decoded.type !== "access" || typeof decoded.id !== "string") {
        next(new Error("Invalid access token"));
        return;
      }

      socket.data.userId = decoded.id;
      next();
    } catch {
      next(new Error("Invalid access token"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.data.userId as string;
    const sockets = userSockets.get(userId) ?? new Set<string>();
    sockets.add(socket.id);
    userSockets.set(userId, sockets);
    socket.join(userId);
    broadcastOnlineUsers();

    socket.on("disconnect", () => {
      const activeSockets = userSockets.get(userId);
      activeSockets?.delete(socket.id);
      if (activeSockets?.size === 0) userSockets.delete(userId);
      broadcastOnlineUsers();
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket.IO has not been initialized");
  return io;
};
