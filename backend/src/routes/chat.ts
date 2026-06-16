import express from "express";
import { protect } from "../middleware/auth";
import ChatMessage from "../models/ChatMessage";
import ChatSession from "../models/ChatSession";

const router = express.Router();

// Create a new chat session (public)
router.post("/sessions", async (req: any, res) => {
  try {
    const { userLabel } = req.body;
    const session = await ChatSession.create({
      userLabel: userLabel || `Anon-${Date.now()}`,
    });
    const io = req.app.get("io");
    if (io) io.to("admins").emit("session:created", session);
    res.status(201).json({ success: true, data: session });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// List sessions (protected for admins)
router.get("/sessions", protect, async (req: any, res) => {
  try {
    const { status } = req.query;
    const filter: any = {};
    if (status) filter.status = status;
    const sessions = await ChatSession.find(filter)
      .sort({ createdAt: -1 })
      .populate("assignedTo", "name email role");
    res.json({ success: true, data: sessions });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get session details (protected for admins)
router.get("/sessions/:id", protect, async (req: any, res) => {
  try {
    const session = await ChatSession.findById(req.params.id).populate(
      "assignedTo",
      "name email role",
    );
    if (!session)
      return res
        .status(404)
        .json({ success: false, message: "Session not found" });
    const messages = await ChatMessage.find({
      sessionId: session._id.toString(),
    }).sort({ timestamp: 1 });
    res.json({ success: true, data: { session, messages } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Public: get messages for a session (no auth required)
router.get("/sessions/:id/messages", async (req: any, res) => {
  try {
    const messages = await ChatMessage.find({ sessionId: req.params.id }).sort({
      timestamp: 1,
    });
    res.json({ success: true, data: messages });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Public: post a user message to a session (anonymous)
router.post("/sessions/:id/messages", async (req: any, res) => {
  try {
    const { message } = req.body;
    const sessionId = req.params.id;
    const msg = await ChatMessage.create({
      sessionId,
      message,
      sender: "user",
    });
    // update session status
    await ChatSession.findByIdAndUpdate(sessionId, { status: "waiting" });
    const io = req.app.get("io");
    if (io) {
      io.to(`session:${sessionId}`).emit("message:created", msg);
      io.to("admins").emit("session:message", { sessionId, message: msg });
    }
    res.status(201).json({ success: true, data: msg });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin: post support message to a session (protected)
router.post("/sessions/:id/messages/admin", protect, async (req: any, res) => {
  try {
    const { message } = req.body;
    const sessionId = req.params.id;
    const msg = await ChatMessage.create({
      sessionId,
      message,
      sender: "support",
      userId: req.user._id,
    });
    await ChatSession.findByIdAndUpdate(sessionId, {
      status: "active",
      assignedTo: req.user._id,
    });
    const io = req.app.get("io");
    if (io) {
      io.to(`session:${sessionId}`).emit("message:created", msg);
      io.to("admins").emit("session:message", { sessionId, message: msg });
    }
    res.status(201).json({ success: true, data: msg });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Assign a session to an admin (protected)
router.put("/sessions/:id/assign", protect, async (req: any, res) => {
  try {
    const adminId = req.body.adminId || req.user._id;
    const session = await ChatSession.findByIdAndUpdate(
      req.params.id,
      { assignedTo: adminId, status: "assigned" },
      { new: true },
    ).populate("assignedTo", "name email role");
    if (!session)
      return res
        .status(404)
        .json({ success: false, message: "Session not found" });
    const io = req.app.get("io");
    if (io) io.to("admins").emit("session:updated", session);
    res.json({ success: true, data: session });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Close a session (protected)
router.put("/sessions/:id/close", protect, async (req: any, res) => {
  try {
    const session = await ChatSession.findByIdAndUpdate(
      req.params.id,
      { status: "closed", closedAt: new Date(), assignedTo: null },
      { new: true },
    );
    if (!session)
      return res
        .status(404)
        .json({ success: false, message: "Session not found" });
    const io = req.app.get("io");
    if (io) io.to("admins").emit("session:updated", session);
    res.json({ success: true, data: session });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
