import express from "express";
import {
  createEmbeddedVideo,
  updateEmbeddedVideo,
  deleteEmbeddedVideo,
  listEmbeddedVideos,
  getEmbeddedVideo,
} from "../controllers/embeddedVideoController";
import { protect, requireRole } from "../middleware/auth";

const router = express.Router();

// Public listing
router.get("/", listEmbeddedVideos);
router.get("/:id", getEmbeddedVideo);

// Admin CRUD
router.post(
  "/admin",
  protect,
  requireRole(["admin", "super"]),
  createEmbeddedVideo,
);
router.put(
  "/admin/:id",
  protect,
  requireRole(["admin", "super"]),
  updateEmbeddedVideo,
);
router.delete(
  "/admin/:id",
  protect,
  requireRole(["admin", "super"]),
  deleteEmbeddedVideo,
);

export default router;
