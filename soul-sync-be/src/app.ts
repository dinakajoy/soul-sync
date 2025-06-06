import express, { Express, Request, Response, NextFunction } from "express";
import createError from "http-errors";
import cors from "cors";
import compression from "compression";
import { limiter } from "./utils/rate-limiter";
import router from "./routes";

const app: Express = express();

app.use(limiter);
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({ message: "Server is running smoothly!" });
});

app.use("/api", router);

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
