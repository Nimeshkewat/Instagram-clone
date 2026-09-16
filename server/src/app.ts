import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFound } from "./middlewares/notFound.js";

const app = express();

// Middlewares
app.use(express.json({ limit: "1mb" }));
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(cookieParser());

// Routes
app.get("/", (req, res) => res.send("Api Working"));

// Error hanling middleware
app.use(notFound);
app.use(errorHandler);

export default app;
