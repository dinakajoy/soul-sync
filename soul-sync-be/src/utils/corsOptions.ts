import cors from "cors";
import logger from "./logger";

const allowedOrigins = [
  "https://soul-sync-platform.vercel.app",
  "http://localhost:3000",
];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      logger.warn(`Blocked by CORS: ${origin}`);
      callback(new Error("CORS policy: This origin is not allowed"), false);
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

export default corsOptions;
