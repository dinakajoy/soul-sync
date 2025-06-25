import express, { Express, Request, Response, NextFunction } from "express";
import config from "config";
import createError from "http-errors";
import cors from "cors";
import jwt from "jsonwebtoken";
import compression from "compression";
import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";

import router from "./routes";
import { User } from "./models/user.model";
import { limiter } from "./utils/rate-limiter";
import corsOptions from "./utils/corsOptions";
import { IUser } from "types";
import { getGoogleId } from "utils/helpers";

const app: Express = express();

app.use(limiter);
app.use(cors<Request>(corsOptions));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());

passport.use(
  new GoogleStrategy(
    {
      clientID: config.get("google.clientID"),
      clientSecret: config.get("google.clientSecret"),
      callbackURL: config.get("google.callbackURL"),
    },
    async function (
      _accessToken: string,
      _refreshToken: string,
      profile: Profile,
      done: (error: any, user?: any) => void
    ) {
      try {
        const email = profile.emails?.[0].value;
        const name = profile.displayName;
        const googleId = profile.id;

        // Check if user exists
        let user = await User.findOne({ email });

        // Setup token: used this approach because cookies won't work on different domain for frontend and backend
        const accessToken = jwt.sign(
          { googleId },
          config.get("environment.secret")!,
          {
            expiresIn: "6h",
          }
        );

        if (!user) {
          // Create new user
          user = new User({
            googleId,
            name,
            email,
            refreshToken: accessToken,
          });
        } else {
          // Update existing user
          user.googleId = googleId;
          user.refreshToken = accessToken;
        }

        await user.save();
        const loggedInUser = {
          _id: user._id,
          googleId: user.googleId,
          name: user.name,
          email: user.email,
          accessToken,
        };
        return done(null, loggedInUser);
      } catch (err) {
        return done(err);
      }
    }
  )
);

app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    message: "Hello! Welcome to Soul Sync, your emotional AI companion",
  });
  return;
});

// Trigger google login
app.get(
  "/auth/google/popup",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

// Handle google login callback
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const user = req.user as IUser | null;
    if (!user) {
      return;
    }
    const html = `
      <script>
      if (window.opener) {
        window.opener.postMessage({ token: "${
          user.accessToken
        }" }, "${config.get('environment.clientURL')}");
        window.close();
      } else {
        console.log("No opener window found.");
      }
      </script>
    `;

    res.send(html);
    return;
  }
);

app.use("/api", router);

app.get("/auth/logout/:token", (req: Request, res: Response) => {
  req.logout(async () => {
    const tokenExist = req.params.token;
    if (tokenExist) {
      const userGoogleId = getGoogleId(tokenExist);
      await User.findOneAndUpdate(
        { googleId: userGoogleId },
        { refreshToken: null, googleId: null },
        { new: true }
      );
    }
    res.redirect(`${config.get("environment.clientURL")}`);
  });
});

// catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new createError.NotFound());
});

// error handler
app.use((err: any, req: Request, res: Response) => {
  res.status(err.status || 500).json({
    status: "error",
    error: err.message,
  });
  return;
});

export default app;
