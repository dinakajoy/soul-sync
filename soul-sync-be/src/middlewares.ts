import { Request, Response, NextFunction } from "express";
import { User } from "./models/user.model";
import { IUser } from "./types";

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ message: "Unauthorized: Please log in." });
    return;
  }

  const userId = (req?.user as IUser)._id;

  const user = await User.findById(userId).exec();
  
  if (!user) {
    res.status(401).json({ message: "Unauthorized: Please log in." });
    return;
  }

  next();
};
