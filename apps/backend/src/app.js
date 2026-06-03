import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import healthRoutes from "./routes/healthRoutes.js";
import callbackRoutes from "./routes/callbackRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import adminReviewRoutes from "./routes/adminReviewRoutes.js";
import { notFound } from "./middlewares/notFound.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const DEV_ORIGINS = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  env.frontendOrigin
];

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || DEV_ORIGINS.includes(origin)) {
          callback(null, true);
        } else {
          callback(null, env.frontendOrigin);
        }
      },
      methods: ["GET", "POST", "PATCH", "OPTIONS"],
      allowedHeaders: ["Content-Type", "X-Admin-Key"]
    })
  );
  app.use(express.json());

  app.use("/api", healthRoutes);
  app.use("/api", callbackRoutes);
  app.use("/api", reviewRoutes);
  app.use("/api/admin", adminReviewRoutes);
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
