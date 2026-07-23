import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Serve Vite build from Express (single-domain production). */
export function attachFrontend(app, { distPath }) {
  const resolvedDist = path.resolve(distPath);

  app.use(
    express.static(resolvedDist, {
      index: false,
      maxAge: "7d"
    })
  );

  app.get("*", (req, res, next) => {
    if (req.method !== "GET" && req.method !== "HEAD") {
      next();
      return;
    }
    if (req.path.startsWith("/api")) {
      next();
      return;
    }
    res.sendFile(path.join(resolvedDist, "index.html"), (err) => {
      if (err) next(err);
    });
  });
}

export function defaultFrontendDistPath() {
  return path.resolve(__dirname, "../../../frontend/dist");
}
