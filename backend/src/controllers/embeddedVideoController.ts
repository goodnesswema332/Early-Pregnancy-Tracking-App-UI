import { Request, Response } from "express";
import EmbeddedVideo from "../models/EmbeddedVideo";

export const createEmbeddedVideo = async (req: any, res: Response) => {
  try {
    const { title, url, provider, description, thumbnail, metadata, protected: isProtected } = req.body;
    if (!title || !url) return res.status(400).json({ success: false, message: "title and url required" });
    const vid = await EmbeddedVideo.create({ title, url, provider, description, thumbnail, metadata, protected: !!isProtected, createdBy: req.user._id });
    res.status(201).json({ success: true, data: vid });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateEmbeddedVideo = async (req: any, res: Response) => {
  try {
    const id = req.params.id;
    const upd = await EmbeddedVideo.findByIdAndUpdate(id, req.body, { new: true });
    if (!upd) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: upd });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteEmbeddedVideo = async (req: any, res: Response) => {
  try {
    const id = req.params.id;
    const del = await EmbeddedVideo.findByIdAndDelete(id);
    if (!del) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const listEmbeddedVideos = async (req: Request, res: Response) => {
  try {
    const videos = await EmbeddedVideo.find().sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, data: videos });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getEmbeddedVideo = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const v = await EmbeddedVideo.findById(id);
    if (!v) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: v });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
