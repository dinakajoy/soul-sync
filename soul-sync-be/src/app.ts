import express, { Express, Request, Response, NextFunction } from "express";
import config from "config";
import createError from "http-errors";
import cors from "cors";
import compression from "compression";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";

import router from "./routes";
import { User } from "./models/user.model";
import { limiter } from "./utils/rate-limiter";
import corsOptions from "./utils/corsOptions";

const app: Express = express();

app.use(limiter);
app.use(cors<Request>(corsOptions));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: config.get("environment.secret"),
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: config.get("dbConfig.url"),
      collectionName: "sessions",
    }),
    cookie: {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: config.get("google.clientID"),
      clientSecret: config.get("google.clientSecret"),
      callbackURL: config.get("google.callbackURL"),
    },
    async function (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: (error: any, user?: any) => void
    ) {
      try {
        const email = profile.emails?.[0].value;
        const name = profile.displayName;
        const googleId = profile.id;

        // Check if user exists
        let user = await User.findOne({ googleId });

        if (!user) {
          // Create new user
          user = new User({
            googleId,
            name,
            email,
          });

          await user.save();
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  return done(null, user._id.toString());
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id).exec();
    if (!user) return done(null, false);
    return done(null, user);
  } catch (err) {
    return done(err);
  }
});

app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    message: "Hello! Welcome to Soul Sync, your emotional AI companion",
  });
  return;
});

// Trigger google login
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Handle google login callback
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${config.get("environment.clientURL")}`,
  }),
  (req, res) => {
    res.redirect("/auth/success");
  }
);

app.get("/auth/success", (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect(`${config.get("environment.clientURL")}/insights`);
  } else {
    res.redirect(`${config.get("environment.clientURL")}`);
  }
});

app.get("/debug/session", (req, res) => {
  res.json({
    sessionID: req.sessionID,
    user: req.user,
    isAuthenticated: req.isAuthenticated?.() || false,
    cookies: req.cookies,
  });
});

app.use("/api", router);

app.get("/auth/logout", (req: Request, res: Response) => {
  req.logout(() => {
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
