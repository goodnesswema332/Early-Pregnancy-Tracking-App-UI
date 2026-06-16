import express from "express";
import { protect } from "../middleware/auth";
import Goal from "../models/Goal";

const router = express.Router();

// Get all user goals
router.get("/", protect, async (req: any, res) => {
  try {
    const goals = await Goal.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });
    res.json({
      success: true,
      data: goals,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create goal
router.post("/", protect, async (req: any, res) => {
  try {
    const goal = await Goal.create({
      userId: req.user._id,
      ...req.body,
    });

    res.status(201).json({
      success: true,
      data: goal,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update goal
router.put("/:id", protect, async (req: any, res) => {
  try {
    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true },
    );

    if (!goal) {
      return res
        .status(404)
        .json({ success: false, message: "Goal not found" });
    }

    res.json({
      success: true,
      data: goal,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete goal
router.delete("/:id", protect, async (req: any, res) => {
  try {
    const goal = await Goal.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!goal) {
      return res
        .status(404)
        .json({ success: false, message: "Goal not found" });
    }

    res.json({
      success: true,
      data: {},
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
