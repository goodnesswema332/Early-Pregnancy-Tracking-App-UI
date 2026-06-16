import mongoose from "mongoose";
import User from "../models/User";

const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI ||
        "mongodb://localhost:27017/pregnancy-prevention-app",
    );

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    // Optional admin seeding
    try {
      const seedEmail = process.env.ADMIN_SEED_EMAIL;
      const seedPassword = process.env.ADMIN_SEED_PASSWORD;
      const seedRole = process.env.ADMIN_SEED_ROLE || "super";
      const secret = process.env.ADMIN_CREATE_SECRET;
      if (seedEmail && seedPassword) {
        const exists = await User.findOne({ email: seedEmail });
        if (!exists) {
          const u = await User.create({
            name: "Seed Admin",
            email: seedEmail,
            password: seedPassword,
            role: seedRole as any,
          });
          console.log("🔐 Seed admin created:", u.email, u.role);
        }
      }
    } catch (e) {
      console.warn("Admin seed failed", e);
    }
  } catch (error: any) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // In development, continue without DB. In production, exit.
    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    } else {
      console.log(
        "⚠️  Continuing without database connection (development mode)",
      );
    }
  }
};

export default connectDB;
