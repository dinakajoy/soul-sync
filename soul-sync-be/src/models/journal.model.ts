import mongoose from "mongoose";

const JournalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  entry: { type: String, required: true },
  reflection: { type: String, required: true },
  themes: [String],
  mood: String,
  date: {
    type: Date,
    default: Date.now,
  },
});

export const Journal = mongoose.model("Journal", JournalSchema);
