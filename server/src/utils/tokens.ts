import crypto from "node:crypto";
import jwt from "jsonwebtoken";

const ACCESS_TOKEN_EXPIRES_IN = "15m";
const REFRESH_TOKEN_DAYS = 7;

const getAccessSecret = () => {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) throw new Error("JWT access secret is missing");
  return secret;
};

const getRefreshSecret = () => {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) throw new Error("JWT refresh secret is missing");
  return secret;
};

export const createAccessToken = (userId: string) =>
  jwt.sign({ id: userId, type: "access" }, getAccessSecret(), {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });

export const createRefreshToken = (userId: string) =>
  jwt.sign(
    { id: userId, type: "refresh", nonce: crypto.randomUUID() },
    getRefreshSecret(),
    {
      expiresIn: `${REFRESH_TOKEN_DAYS}d`,
    },
  );

export const hashRefreshToken = (token: string) =>
  crypto.createHash("sha256").update(token).digest("hex");

export const refreshTokenExpiresAt = () =>
  new Date(Date.now() + REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000);

export const verifyAccessToken = (token: string) =>
  jwt.verify(token, getAccessSecret()) as jwt.JwtPayload;

export const verifyRefreshToken = (token: string) =>
  jwt.verify(token, getRefreshSecret()) as jwt.JwtPayload;

export const accessCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: (process.env.NODE_ENV === "production" ? "none" : "lax") as
    | "none"
    | "lax",
  maxAge: 15 * 60 * 1000,
  path: "/",
});

export const refreshCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: (process.env.NODE_ENV === "production" ? "none" : "lax") as
    | "none"
    | "lax",
  maxAge: REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000,
  path: "/api/v1/users",
});
