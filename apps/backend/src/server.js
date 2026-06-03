import "dotenv/config";
import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { initDatabase } from "./db/initDb.js";
import { isEmailConfigured } from "./services/emailService.js";
import { logStartup } from "./utils/logger.js";

async function startServer() {
  try {
    await initDatabase();
    console.log(`PostgreSQL connected: ${env.db.host}:${env.db.port}/${env.db.name}`);
  } catch (err) {
    console.error("Failed to connect to PostgreSQL:", err.message);
    console.error(
      "Check DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME in apps/backend/.env"
    );
    process.exit(1);
  }

  const app = createApp();

  app.listen(env.port, () => {
    logStartup(env.port);
    if (!isEmailConfigured()) {
      console.warn(
        "Callback email is NOT configured. Form submissions will still be saved to PostgreSQL."
      );
    }
  });
}

startServer();
