import express from "express";
import {
  register,
  login,
  getMe,
  seedAdmin,
} from "../controllers/authController";
import { protect } from "../middleware/auth";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/seed-admin", seedAdmin);
router.get("/me", protect, getMe);

export default router;
