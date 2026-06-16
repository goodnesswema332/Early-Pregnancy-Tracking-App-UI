import mongoose, { Document, Schema } from "mongoose";

export interface IFaq extends Document {
  category?: string;
  question: string;
  answer: string;
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const faqSchema = new Schema<IFaq>({
  category: { type: String },
  question: { type: String, required: true },
  answer: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IFaq>("Faq", faqSchema);
