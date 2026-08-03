import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { corsOrigin } from "./config/cors.js";
import healthRoutes from "./routes/healthRoutes.js";
import callbackRoutes from "./routes/callbackRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import adminReviewRoutes from "./routes/adminReviewRoutes.js";
import { attachFrontend, defaultFrontendDistPath } from "./middlewares/serveFrontend.js";
import { canonicalHostRedirect } from "./middlewares/canonicalHostRedirect.js";
import { notFound } from "./middlewares/notFound.js";
import { errorHandler } from "./middlewares/errorHandler.js";

export function createApp() {
  const app = express();

  if (env.nodeEnv === "production") {
    app.set("trust proxy", 1);
  }

  app.use(
    cors({
      origin: corsOrigin,
      methods: ["GET", "POST", "PATCH", "OPTIONS"],
      allowedHeaders: ["Content-Type", "X-Admin-Key"]
    })
  );
  app.use(express.json());
  app.use(canonicalHostRedirect);

  app.use("/api", healthRoutes);
  app.use("/api", callbackRoutes);
  app.use("/api", reviewRoutes);
  app.use("/api/admin", adminReviewRoutes);

  if (env.serveFrontend) {
    attachFrontend(app, { distPath: defaultFrontendDistPath() });
  } else {
    app.get("*", (req, res, next) => {
      if (req.path.startsWith("/api")) {
        next();
        return;
      }
      res.redirect(`${env.frontendOrigin}${req.originalUrl}`);
    });
  }

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
