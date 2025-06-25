import mongoose, { Document, Schema, Model } from "mongoose";
import { IUser } from "../types";

const UserSchema: Schema<IUser> = new Schema(
  {
    googleId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    refreshToken: { type: String },
  },
  { timestamps: true }
);

export const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);
