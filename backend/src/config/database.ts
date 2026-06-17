import mongoose from "mongoose";
import User from "../models/User";

const connectDB = async (): Promise<void> => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.error("❌ MONGODB_URI not defined in environment variables");
    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    }
    console.log("⚠️  Continuing without database (development mode)");
    return;
  }

  // Connection options optimized for MongoDB Atlas
  const options: mongoose.ConnectOptions = {
    retryWrites: true,
    w: "majority",
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  };

  try {
    const conn = await mongoose.connect(mongoUri, options);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);

    // Optional admin seeding
    try {
      const seedEmail = process.env.ADMIN_SEED_EMAIL;
      const seedPassword = process.env.ADMIN_SEED_PASSWORD;
      const seedRole = process.env.ADMIN_SEED_ROLE || "super";
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
      console.warn("⚠️  Admin seed failed:", (e as Error).message);
    }
  } catch (error: any) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error("💡 Tip: Check your MONGODB_URI in .env file");
    console.error("📖 See MONGODB_SETUP.md for setup instructions");

    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    } else {
      console.log("⚠️  Continuing without database (development mode)");
    }
  }
};

export default connectDB;
