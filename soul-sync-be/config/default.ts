import dotenv from "dotenv-safe";

dotenv.config();

export default {
  environment: {
    host: process.env.HOST || "0.0.0.0",
    port: Number(String(process.env.PORT)) || 1337,
    apiKey: process.env.API_KEY || "",
  },
  dbConfig: {
    url: process.env.DATABASE_URL || "",
  },
};
