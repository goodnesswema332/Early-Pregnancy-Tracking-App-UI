import { Request, Response } from "express";
import User from "../models/User";
import mongoose from "mongoose";
import RefreshToken from "../models/RefreshToken";
import bcrypt from "bcryptjs";
import {
  generateAccessToken,
  generateRefreshTokenPair,
} from "../utils/generateToken";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, adminSecret } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // If role is provided and not 'user', require adminSecret
    let createRole = "user";
    if (role && role !== "user") {
      if (
        !process.env.ADMIN_CREATE_SECRET ||
        adminSecret !== process.env.ADMIN_CREATE_SECRET
      ) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to create admin role",
        });
      }
      createRole = role;
    }

    // Create user
    const user = await User.create({ name, email, password, role: createRole });
    const totalAfterCreate = await User.countDocuments({});
    console.log(
      "authController.register: total users after create=",
      totalAfterCreate,
      "collection=",
      (User as any).collection?.name,
      "mongoose readyState=",
      mongoose.connection.readyState,
      "dbName=",
      mongoose.connection.name || (mongoose.connection as any).db?.databaseName,
    );

    if (user) {
      // create refresh token entry
      const { token, tokenId, tokenSecret, expiresAt } =
        generateRefreshTokenPair() as any;
      const tokenHash = await bcrypt.hash(tokenSecret, 10);
      await RefreshToken.create({
        user: user._id,
        tokenId,
        tokenHash,
        expiresAt,
      });

      res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          progress: user.progress,
          role: user.role,
          accessToken: generateAccessToken(user._id.toString()),
          refreshToken: token,
        },
      });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log("authController.login: attempt for", email);
    const totalUsers = await User.countDocuments({});
    console.log(
      "authController.login: total users in collection=",
      totalUsers,
      "collection=",
      (User as any).collection?.name,
      "mongoose readyState=",
      mongoose.connection.readyState,
      "dbName=",
      mongoose.connection.name || (mongoose.connection as any).db?.databaseName,
    );
    try {
      const docs = await (mongoose.connection.db as any)
        .collection((User as any).collection?.name || "users")
        .find({})
        .toArray();
      console.log("authController.login: raw users docs length=", docs.length);
    } catch (e) {
      console.log("authController.login: raw users docs fetch error", e);
    }

    // Check for user
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Debug: ensure password present
    console.log(
      "authController.login: user found for",
      email,
      "passwordPresent=",
      !!(user as any).password,
    );

    // Check password
    const isMatch = await user.comparePassword(password);
    console.log("authController.login: compare result for", email, isMatch);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Update last active
    user.progress.lastActive = new Date();
    await user.save();

    // create and store refresh token (rotation)
    const { token, tokenId, tokenSecret, expiresAt } =
      generateRefreshTokenPair() as any;
    const tokenHash = await bcrypt.hash(tokenSecret, 10);
    await RefreshToken.create({
      user: user._id,
      tokenId,
      tokenHash,
      expiresAt,
    });

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        progress: user.progress,
        role: user.role,
        accessToken: generateAccessToken(user._id.toString()),
        refreshToken: token,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMe = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user._id);

    res.json({ success: true, data: user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body as any;
    if (!refreshToken)
      return res
        .status(400)
        .json({ success: false, message: "refreshToken required" });

    const parsed = (await import("../utils/generateToken")).parseRefreshToken(
      refreshToken,
    );
    if (!parsed)
      return res
        .status(401)
        .json({ success: false, message: "Invalid token format" });

    const { tokenId, tokenSecret } = parsed as any;
    const existing = await RefreshToken.findOne({ tokenId });
    if (!existing)
      return res.status(401).json({ success: false, message: "Invalid token" });
    if (existing.expiresAt < new Date()) {
      await existing.deleteOne();
      return res.status(401).json({ success: false, message: "Token expired" });
    }

    const valid = await bcrypt.compare(tokenSecret, existing.tokenHash);
    if (!valid)
      return res.status(401).json({ success: false, message: "Invalid token" });

    // rotation: remove old and issue new
    await existing.deleteOne();
    const {
      token,
      tokenId: newId,
      tokenSecret: newSecret,
      expiresAt,
    } = generateRefreshTokenPair() as any;
    const newHash = await bcrypt.hash(newSecret, 10);
    await RefreshToken.create({
      user: existing.user,
      tokenId: newId,
      tokenHash: newHash,
      expiresAt,
    });

    res.json({
      success: true,
      data: {
        accessToken: generateAccessToken(existing.user.toString()),
        refreshToken: token,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body as any;
    if (!refreshToken)
      return res
        .status(400)
        .json({ success: false, message: "refreshToken required" });

    const parsed = (await import("../utils/generateToken")).parseRefreshToken(
      refreshToken,
    );
    if (!parsed) return res.status(200).json({ success: true });

    const { tokenId } = parsed as any;
    await RefreshToken.findOneAndDelete({ tokenId });
    return res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create a seed admin via API (requires ADMIN_CREATE_SECRET)
export const seedAdmin = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role = "super", secret } = req.body as any;

    if (
      !process.env.ADMIN_CREATE_SECRET ||
      secret !== process.env.ADMIN_CREATE_SECRET
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized to seed admin" });
    }

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.json({
        success: true,
        data: {
          _id: exists._id,
          email: exists.email,
          role: exists.role,
          name: exists.name,
          accessToken: generateAccessToken(exists._id.toString()),
        },
      });
    }

    const user = await User.create({
      name: name || "Seed Admin",
      email,
      password,
      role,
    });

    // create refresh token for seed admin
    const { token, tokenId, tokenSecret, expiresAt } =
      generateRefreshTokenPair() as any;
    const tokenHash = await bcrypt.hash(tokenSecret, 10);
    await RefreshToken.create({
      user: user._id,
      tokenId,
      tokenHash,
      expiresAt,
    });

    return res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        accessToken: generateAccessToken(user._id.toString()),
        refreshToken: token,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
