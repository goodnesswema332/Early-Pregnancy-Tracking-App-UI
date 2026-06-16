import dotenv from "dotenv";
import connectDB from "../src/config/database";
import User from "../src/models/User";
import RefreshToken from "../src/models/RefreshToken";
import {
  generateAccessToken,
  generateRefreshTokenPair,
} from "../src/utils/generateToken";
import bcrypt from "bcryptjs";

dotenv.config();

const main = async () => {
  try {
    await connectDB();
    const email = process.env.SUPER_ADMIN_EMAIL;
    const password = process.env.SUPER_ADMIN_PASSWORD;
    if (!email || !password) {
      console.error(
        "SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD must be provided",
      );
      process.exit(1);
    }

    const existing = await User.findOne({ role: "super" });
    if (existing) {
      console.log("Super admin already exists:", existing.email);
      process.exit(0);
    }

    const user = await User.create({
      name: "Super Admin",
      email,
      password,
      role: "super",
    });
    const { token, tokenId, tokenSecret, expiresAt } =
      generateRefreshTokenPair() as any;
    const tokenHash = await bcrypt.hash(tokenSecret, 10);
    await RefreshToken.create({
      user: user._id,
      tokenId,
      tokenHash,
      expiresAt,
    });

    console.log("Super admin created:", user.email);
    console.log("Access Token:", generateAccessToken(user._id.toString()));
    console.log("Refresh Token:", token);
    process.exit(0);
  } catch (err: any) {
    console.error("Failed to bootstrap super admin", err);
    process.exit(1);
  }
};

main();
