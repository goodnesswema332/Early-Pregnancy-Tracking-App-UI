import express from 'express';
import { protect } from '../middleware/auth';
import User from '../models/User';

const router = express.Router();

// Get user progress
router.get('/progress', protect, async (req: any, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      success: true,
      data: user?.progress
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update user progress
router.put('/progress', protect, async (req: any, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (req.body.modulesCompleted !== undefined) user.progress.modulesCompleted = req.body.modulesCompleted;
    if (req.body.badgesEarned) user.progress.badgesEarned = req.body.badgesEarned;
    if (req.body.streak !== undefined) user.progress.streak = req.body.streak;

    user.progress.lastActive = new Date();
    await user.save();

    res.json({
      success: true,
      data: user.progress
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
