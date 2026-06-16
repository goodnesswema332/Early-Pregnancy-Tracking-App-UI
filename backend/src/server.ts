import dotenv from "dotenv";
import { createServer } from "http";
import { Server as IOServer } from "socket.io";
import jwt from "jsonwebtoken";
import app from "./app";
import connectDB from "./config/database";
import User from "./models/User";
import ChatMessage from "./models/ChatMessage";
import ChatSession from "./models/ChatSession";

dotenv.config();

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();

  const server = createServer(app);
  const io = new IOServer(server, {
    cors: { origin: process.env.FRONTEND_URL || "http://localhost:8081", credentials: true },
  });

  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        (socket.handshake.headers?.authorization?.toString().startsWith("Bearer")
          ? socket.handshake.headers?.authorization.toString().split(" ")[1]
          : undefined);
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "default-secret") as { id: string };
        const user = await User.findById(decoded.id).select("+password");
        if (user) {
          (socket as any).data = { user };
          if (["admin", "super", "agent"].includes(user.role)) socket.join("admins");
        }
      }
    } catch (e) {
      // ignore
    }
    next();
  });

  io.on("connection", (socket) => {
    console.log("Socket connected", socket.id);
    socket.on("joinSession", ({ sessionId }: { sessionId: string }) => socket.join(`session:${sessionId}`));
    socket.on("joinAdmins", () => socket.join("admins"));

    socket.on("sendMessage", async (payload: any, callback: any) => {
      try {
        const { sessionId, message, sender } = payload || {};
        if (!sessionId || !message) return callback && callback({ success: false, error: "Invalid payload" });

        let msg: any;
        if (sender === "support" || sender === "admin") {
          const user = (socket as any).data?.user;
          msg = await ChatMessage.create({ sessionId, message, sender: "support", userId: user?._id });
          await ChatSession.findByIdAndUpdate(sessionId, { status: "active", assignedTo: user?._id });
        } else {
          msg = await ChatMessage.create({ sessionId, message, sender: "user" });
          await ChatSession.findByIdAndUpdate(sessionId, { status: "waiting" });
        }

        io.to(`session:${sessionId}`).emit("message:created", msg);
        io.to("admins").emit("session:message", { sessionId, message: msg });

        return callback && callback({ success: true, data: msg });
      } catch (err: any) {
        console.error("Socket sendMessage error", err);
        return callback && callback({ success: false, error: err.message || "Server error" });
      }
    });

    socket.on("disconnect", () => console.log("Socket disconnected", socket.id));
  });

  app.set("io", io);

  server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT} - env=${process.env.NODE_ENV || "development"}`));
};

start().catch((err) => {
  console.error("Failed to start server", err);
  process.exit(1);
});
