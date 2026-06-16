import mongoose, { Document, Schema } from "mongoose";

export interface IChatSession extends Document {
  userLabel?: string;
  createdAt: Date;
  status: "waiting" | "assigned" | "active" | "closed";
  assignedTo?: mongoose.Types.ObjectId | null;
  closedAt?: Date | null;
}

const chatSessionSchema = new Schema<IChatSession>({
  userLabel: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["waiting", "assigned", "active", "closed"],
    default: "waiting",
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  closedAt: {
    type: Date,
    default: null,
  },
});

export default mongoose.model<IChatSession>("ChatSession", chatSessionSchema);
