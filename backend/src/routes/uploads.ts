import express from "express";
import { generatePresignedUploadUrl, uploadBuffer } from "../utils/r2";
import { protect, requireRole } from "../middleware/auth";
import multer from "multer";

const router = express.Router();
const upload = multer();

// Generate presigned URL for client direct upload to R2
router.post("/presign", protect, requireRole(["admin", "super"]), async (req, res) => {
  try {
    const { filename, contentType } = req.body as any;
    if (!filename) return res.status(400).json({ success: false, message: "filename required" });
    const key = `${Date.now()}_${filename}`;
    const url = await generatePresignedUploadUrl(key, contentType || "application/octet-stream");
    res.json({ success: true, data: { uploadUrl: url, key } });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Server-side buffer upload (admin)
router.post("/upload-buffer", protect, requireRole(["admin", "super"]), upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "file required" });
    const key = `${Date.now()}_${req.file.originalname}`;
    const url = await uploadBuffer(key, req.file.buffer, req.file.mimetype);
    res.json({ success: true, data: { url, key } });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
