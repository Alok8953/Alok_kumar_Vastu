import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import healthRoutes from "./routes/healthRoutes.js";
import { notFound } from "./middlewares/notFound.js";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: env.frontendOrigin
    })
  );
  app.use(express.json());

  app.use("/api", healthRoutes);
  app.use(notFound);

  return app;
}
