import mongoose, { Document, Schema } from 'mongoose';

export interface ITopic extends Document {
  title: string;
  description?: string;
  category?: string;
  content?: string;
  protected?: boolean;
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const topicSchema = new Schema<ITopic>({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  content: { type: String },
  protected: { type: Boolean, default: false },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<ITopic>('Topic', topicSchema);
