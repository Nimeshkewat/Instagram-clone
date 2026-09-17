import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError.js";
import jwt, { type JwtPayload } from "jsonwebtoken";

export const isAuthenticated = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const { token } = req.cookies;
  if (!token) {
    throw new AppError(401, "Not Authorized");
  }

  if (!process.env.JWT_SECRET) {
    throw new AppError(500, "JWT_SECREIT KEY iS MISSING");
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
  if (!decoded) {
    throw new AppError(401, "Invalid Token");
  }

  req.user = {
    id: decoded.id,
  };
  next();
};
