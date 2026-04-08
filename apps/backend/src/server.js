import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { logStartup } from "./utils/logger.js";

const app = createApp();

app.listen(env.port, () => {
  logStartup(env.port);
});
