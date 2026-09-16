import type { ErrorRequestHandler } from "express";
import mongoose from "mongoose";
import { AppError } from "../utils/AppError.js";

const isProd = process.env.NODE_ENV === "production";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  let statusCode = 500;
  let message = "Internal server error";

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  } else if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = `Invalid ${err.path}: ${String(err.value)}`;
  } else if (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    err.code === 11000
  ) {
    statusCode = 409;
    const keyValue =
      "keyValue" in err && err.keyValue && typeof err.keyValue === "object"
        ? Object.keys(err.keyValue as object).join(", ")
        : "field";
    message = `Duplicate value for ${keyValue}`;
  } else if (err instanceof Error) {
    message = isProd ? "Internal server error" : err.message;
  }

  const isOperational = err instanceof AppError && err.isOperational;
  if (!isProd && !isOperational) {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(isProd ? {} : { stack: err instanceof Error ? err.stack : undefined }),
  });
};
