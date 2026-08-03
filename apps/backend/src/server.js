import "./loadEnv.js";
import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { initDatabase } from "./db/initDb.js";
import { isEmailConfigured } from "./services/emailService.js";
import { retryPendingReviewEmails } from "./services/reviewEmailRecoveryService.js";
import { logStartup } from "./utils/logger.js";

async function startServer() {
  try {
    await initDatabase();
    console.log(`PostgreSQL connected: ${env.db.host}:${env.db.port}/${env.db.name}`);
  } catch (err) {
    console.error("Failed to connect to PostgreSQL:", err.message);
    console.error(
      "Check DATABASE_URL (or DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME) in apps/backend/.env"
    );
    process.exit(1);
  }

  const app = createApp();

  const server = app.listen(env.port, "0.0.0.0", () => {
    logStartup(env.port);
    if (env.serveFrontend) {
      console.log(`Serving website + API on port ${env.port} (production mode)`);
    }
    if (!isEmailConfigured()) {
      console.warn(
        "Callback email is NOT configured. Form submissions will still be saved to PostgreSQL."
      );
    } else {
      void retryPendingReviewEmails().catch((error) => {
        console.error("Pending review email recovery failed:", error.message);
      });
    }
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(
        `Port ${env.port} is already in use. From Vastu_proj run: npm run dev (it frees ports automatically).`
      );
      process.exit(1);
    }
    console.error("Server error:", err.message);
    process.exit(1);
  });
}

startServer();
