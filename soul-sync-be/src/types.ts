import { Document } from "mongoose";

export interface IUser extends Document {
  googleId: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  refreshToken?: string;
  accessToken?: string;
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

export interface JwtPayload {
  [key: string]: any;
  iss?: string | undefined;
  sub?: string | undefined;
  aud?: string | string[] | undefined;
  exp?: number | undefined;
  nbf?: number | undefined;
  iat?: number | undefined;
  jti?: string | undefined;
}