import express, { Router } from "express";
import { protect } from "../middleware/auth";
import QuizResult from "../models/QuizResult";

const router: Router = express.Router();

// Get user quiz results
router.get("/results", protect, async (req: any, res) => {
  try {
    const results = await QuizResult.find({ userId: req.user._id }).sort({
      completedAt: -1,
    });
    res.json({
      success: true,
      data: results,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Submit quiz result
router.post("/submit", protect, async (req: any, res) => {
  try {
    const result = await QuizResult.create({
      userId: req.user._id,
      ...req.body,
    });

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
