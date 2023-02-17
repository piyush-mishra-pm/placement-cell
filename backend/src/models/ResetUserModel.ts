import { Document, model, Schema } from "mongoose";

export const TOKEN_VAILIDITY_DURATION_IN_MINUTES = 1;

export interface ResetUserDocument extends Document {
  email: string;
  token: string;
  validity: number;
}

// time to live: (else too much memory wasted)
const resetUserSchema = new Schema<ResetUserDocument>({
  email: {
    type: String,
    required: true
  },
  token: {
    type: String,
    unique: true, // Each Token should be unique.
    required: true
  }
}, { timestamps: true });

resetUserSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * TOKEN_VAILIDITY_DURATION_IN_MINUTES });

export const ResetUserModel = model<ResetUserDocument>('reset', resetUserSchema);
