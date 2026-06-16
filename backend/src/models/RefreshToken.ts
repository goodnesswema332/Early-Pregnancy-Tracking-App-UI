import mongoose, { Document, Schema } from "mongoose";

export interface IRefreshToken extends Document {
  user: mongoose.Types.ObjectId;
  tokenId: string;
  tokenHash: string;
  expiresAt: Date;
  createdAt: Date;
  userAgent?: string;
}

const refreshTokenSchema = new Schema<IRefreshToken>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  tokenId: { type: String, required: true, index: true, unique: true },
  tokenHash: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  userAgent: { type: String },
});

export default mongoose.model<IRefreshToken>("RefreshToken", refreshTokenSchema);
