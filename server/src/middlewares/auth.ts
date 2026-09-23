import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError.js";
import { verifyAccessToken } from "../utils/tokens.js";

export const isAuthenticated = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const { accessToken } = req.cookies;
  if (!accessToken) {
    throw new AppError(401, "Not Authorized");
  }

  let decoded;
  try {
    decoded = verifyAccessToken(accessToken);
  } catch {
    throw new AppError(401, "Invalid Token");
  }

  if (decoded.type !== "access" || typeof decoded.id !== "string") {
    throw new AppError(401, "Invalid Token");
  }

  req.user = {
    id: decoded.id,
  };
  next();
};
