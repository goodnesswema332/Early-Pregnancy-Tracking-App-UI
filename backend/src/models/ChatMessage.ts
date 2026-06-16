import mongoose, { Document, Schema } from "mongoose";

export interface IChatMessage extends Document {
  userId?: mongoose.Types.ObjectId | null;
  sessionId: string;
  sender: "user" | "support";
  message: string;
  timestamp: Date;
  read: boolean;
}

const chatMessageSchema = new Schema<IChatMessage>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  sessionId: {
    type: String,
    required: true,
  },
  sender: {
    type: String,
    enum: ["user", "support"],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  read: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model<IChatMessage>("ChatMessage", chatMessageSchema);
