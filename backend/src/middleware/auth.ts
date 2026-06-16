import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../models/User";
import { verifyAccessToken } from "../utils/generateToken";

export interface AuthRequest extends Request {
  user?: IUser;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    let token: string | undefined;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    try {
      const decoded = verifyAccessToken(token) as { id: string };

      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(401).json({ success: false, message: "User not found" });
      }

      req.user = user;
      next();
    } catch (err) {
      return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
  } catch (error) {
    next(error);
  }
};

export const requireRole = (roles: string | string[]) => {
  const allowed = Array.isArray(roles) ? roles : [roles];
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }
    if (!allowed.includes(req.user.role as string)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }
    next();
  };
};
