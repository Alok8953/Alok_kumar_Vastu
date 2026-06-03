import { checkDatabaseConnection } from "../db/pool.js";
import { healthResponseExample } from "@repo/shared-types";

export async function getHealthStatus() {
  let database = "disconnected";

  try {
    await checkDatabaseConnection();
    database = "connected";
  } catch {
    database = "disconnected";
  }

  return {
    ...healthResponseExample,
    database
  };
}
