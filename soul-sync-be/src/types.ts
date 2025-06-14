import { Document } from "mongoose";

export interface IUser extends Document {
  googleId: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export type OpenAICheckinResponse = {
  emotion: string;
  response: string;
  affirmations: string[];
};

export type OpenAIJournalResponse = {
  summary: string;
  themes: string[];
  mood: string;
};

export type OpenAISyncResponse = {
  response: string;
  question: string;
};