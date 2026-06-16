import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:8081",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Routes
import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";
import educationRoutes from "./routes/education";
import goalsRoutes from "./routes/goals";
import quizRoutes from "./routes/quiz";
import chatRoutes from "./routes/chat";
import healthServicesRoutes from "./routes/healthServices";
import embeddedVideosRoutes from "./routes/embeddedVideos";
import uploadsRoutes from "./routes/uploads";

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/education", educationRoutes);
app.use("/api/goals", goalsRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/health-services", healthServicesRoutes);
app.use("/api/videos", embeddedVideosRoutes);
app.use("/api/uploads", uploadsRoutes);

// Serve uploaded thumbnails and static assets
app.use(
  "/uploads",
  express.static(path.join(__dirname, "..", "..", "uploads")),
);

// Health check
app.get("/api/health", (req, res) =>
  res.json({
    status: "ok",
    message: "API is running",
    timestamp: new Date().toISOString(),
  }),
);

// Error handling
app.use((err: any, req: any, res: any, _next: any) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

export default app;
