import config from "config";
import jwt, { JwtPayload } from "jsonwebtoken";

const accessTokenSecret = config.get("environment.secret") as string;

export const getGoogleId = (tokenString: string): string => {
  const decodedToken = jwt.verify(tokenString, accessTokenSecret) as JwtPayload;

  const userGoogleId = decodedToken.googleId;
  return userGoogleId;
};
