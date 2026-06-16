import jwt from "jsonwebtoken";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "default-secret";
const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || "15m";
const REFRESH_TOKEN_EXPIRES_DAYS = parseInt(
  process.env.REFRESH_TOKEN_EXPIRES_DAYS || "30",
  10,
);

export const generateAccessToken = (id: string): string => {
  return jwt.sign({ id }, JWT_SECRET as any, { expiresIn: ACCESS_TOKEN_EXPIRES_IN } as any);
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET as any) as { id: string; iat: number; exp: number };
};

export const generateRefreshTokenPair = () => {
  const tokenId = crypto.randomBytes(8).toString("hex");
  const tokenSecret = crypto.randomBytes(64).toString("hex");
  const token = `${tokenId}.${tokenSecret}`;
  const expiresAt = new Date(
    Date.now() + REFRESH_TOKEN_EXPIRES_DAYS * 24 * 60 * 60 * 1000,
  );
  return { tokenId, tokenSecret, token, expiresAt };
};

export const parseRefreshToken = (token: string) => {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  return { tokenId: parts[0], tokenSecret: parts[1] };
};
