import { Request, Response, NextFunction } from "express";
import { User } from "./models/user.model";
import { JwtPayload } from "./types";
import logger from "utils/logger";
import { getGoogleId } from "utils/helpers";

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const tokenExist = req.headers["authorization"];
  if (!tokenExist) {
    res.status(401).json({ message: "Unauthorized: Please log in." });
    return;
  } else {
    try {
      const userGoogleId = getGoogleId(tokenExist);
      const result = await User.findOne({ googleId: userGoogleId }).lean();

      if (!result || result.refreshToken !== tokenExist.split(" ")[1]) {
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
