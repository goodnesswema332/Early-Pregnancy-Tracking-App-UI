import mongoose, { Document, Schema } from "mongoose";

export interface IVideo extends Document {
  title: string;
  description?: string;
  url?: string;
  thumbnail?: string;
  protected?: boolean;
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const videoSchema = new Schema<IVideo>({
  title: { type: String, required: true },
  description: { type: String },
  url: { type: String },
  thumbnail: { type: String },
  protected: { type: Boolean, default: false },
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IVideo>("Video", videoSchema);
