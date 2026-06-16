import { Request, Response } from 'express';
import User from '../models/User';
import { generateToken } from '../utils/generateToken';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, adminSecret } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // If role is provided and not 'user', require adminSecret
    let createRole = 'user';
    if (role && role !== 'user') {
      if (!process.env.ADMIN_CREATE_SECRET || adminSecret !== process.env.ADMIN_CREATE_SECRET) {
        return res.status(403).json({ success: false, message: 'Not authorized to create admin role' });
      }
      createRole = role;
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: createRole,
    });

    if (user) {
      res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          progress: user.progress,
          role: user.role,
          token: generateToken(user._id.toString())
        }
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last active
    user.progress.lastActive = new Date();
    await user.save();

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        progress: user.progress,
        role: user.role,
        token: generateToken(user._id.toString())
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getMe = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user._id);

    res.json({
      success: true,
      data: user
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Create a seed admin via API (requires ADMIN_CREATE_SECRET)
export const seedAdmin = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role = 'super', secret } = req.body as any;

    if (!process.env.ADMIN_CREATE_SECRET || secret !== process.env.ADMIN_CREATE_SECRET) {
      return res.status(403).json({ success: false, message: 'Not authorized to seed admin' });
    }

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      // if exists, return existing user (avoid leaking password)
      return res.json({ success: true, data: { _id: exists._id, email: exists.email, role: exists.role, name: exists.name, token: generateToken(exists._id.toString()) } });
    }

    const user = await User.create({ name: name || 'Seed Admin', email, password, role });

    return res.status(201).json({ success: true, data: { _id: user._id, name: user.name, email: user.email, role: user.role, token: generateToken(user._id.toString()) } });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
