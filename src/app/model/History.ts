import mongoose from "mongoose";

const historySchema = new mongoose.Schema(
  {user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
   language: String,
  code: String,
  timeComplexity: String,
  spaceComplexity: String,
  explanation: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  },
  
);

export const History =
  mongoose.models.History || mongoose.model("History", historySchema);
