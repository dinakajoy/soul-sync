import dotenv from "dotenv-safe";

dotenv.config();

export default {
  environment: {
    host: process.env.HOST || "0.0.0.0",
    port: Number(String(process.env.PORT)) || 1337,
    apiKey: process.env.API_KEY || "",
    secret: process.env.SECRET || "",
    clientURL: process.env.CLIENT_URL || "http://localhost:3000",
  },
  dbConfig: {
    url: process.env.DATABASE_URL || "",
  },
  google: {
    clientID: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    callbackURL: process.env.GOOGLE_CALLBACK_URL || "",
  },
};
