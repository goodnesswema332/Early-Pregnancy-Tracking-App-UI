import mongoose, { Document, Schema } from 'mongoose';

export interface IQuizResult extends Document {
  userId: mongoose.Types.ObjectId;
  quizId: string;
  quizTitle: string;
  score: number;
  totalQuestions: number;
  answers: Array<{
    questionId: string;
    selectedAnswer: string;
    correct: boolean;
  }>;
  completedAt: Date;
}

const quizResultSchema = new Schema<IQuizResult>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quizId: {
    type: String,
    required: true
  },
  quizTitle: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  answers: [{
    questionId: String,
    selectedAnswer: String,
    correct: Boolean
  }],
  completedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<IQuizResult>('QuizResult', quizResultSchema);
