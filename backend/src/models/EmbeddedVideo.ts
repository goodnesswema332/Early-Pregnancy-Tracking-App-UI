import mongoose, { Document, Schema } from "mongoose";

export interface IEmbeddedVideo extends Document {
  title: string;
  description?: string;
  url: string;
  provider?: string; // e.g., youtube, vimeo, raw
  thumbnail?: string;
  metadata?: Record<string, any>;
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  protected?: boolean;
}

const embeddedVideoSchema = new Schema<IEmbeddedVideo>({
  title: { type: String, required: true },
  description: { type: String },
  url: { type: String, required: true },
  provider: { type: String },
  thumbnail: { type: String },
  metadata: { type: Schema.Types.Mixed },
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  protected: { type: Boolean, default: false },
});

export default mongoose.model<IEmbeddedVideo>("EmbeddedVideo", embeddedVideoSchema);
