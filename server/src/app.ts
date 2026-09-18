import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFound } from "./middlewares/notFound.js";

import userRouter from "./routes/userRoutes.js";
import postRouter from "./routes/postRoutes.js";
import commentRouter from "./routes/commentRoutes.js";
import messageRouter from "./routes/messageRoutes.js";

const app = express();

// Middlewares
app.use(express.json({ limit: "1mb" }));
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(cookieParser());

// Routes
app.get("/", (req, res) => res.send("Api Working"));
app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/messages", messageRouter);

// Error hanling middleware
app.use(notFound);
app.use(errorHandler);

export default app;
