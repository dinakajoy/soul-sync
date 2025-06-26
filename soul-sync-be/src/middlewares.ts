import { Request, Response, NextFunction } from "express";
import { User } from "./models/user.model";
import logger from "utils/logger";
import { getGoogleId } from "utils/helpers";

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const tokenString = req.headers["authorization"];
  const token = tokenString?.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "Unauthorized: Please log in." });
    return;
  } else {
    try {
      const userGoogleId = getGoogleId(token);
      const result = await User.findOne({ googleId: userGoogleId }).lean();

      if (!result || result.refreshToken !== token) {
        res.status(401).json({ message: "Unauthorized: Please log in." });
        return;
      }
      req.user = result;
      next();
    } catch (error: any) {
      logger.error(`isAuthenticated Middleware Error: ${error.message}`);
      res.status(401).json({ message: "Error: Please log in." });
      return;
    }
  }
};
