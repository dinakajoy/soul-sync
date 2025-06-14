import "express-session";
import { IUser } from "../../models/user.model";

declare module "express-session" {
  interface SessionData {
    user?: { _id: string };
  }
}

declare global {
  namespace Express {
    interface User extends IUser {}
  }
}
