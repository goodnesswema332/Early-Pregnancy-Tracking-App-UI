import express from "express";
import {
  register,
  login,
  getMe,
  seedAdmin,
  refreshToken,
  logout,
} from "../controllers/authController";
import { protect } from "../middleware/auth";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/seed-admin", seedAdmin);
router.post("/refresh", refreshToken);
router.post("/logout", logout);
router.get("/me", protect, getMe);

export default router;
