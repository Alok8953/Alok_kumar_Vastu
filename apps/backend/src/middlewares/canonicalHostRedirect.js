import { env } from "../config/env.js";
import { getCanonicalSiteHostname } from "../config/siteOrigins.js";

/** Redirect www → apex (or apex host from FRONTEND_ORIGIN) in production. */
export function canonicalHostRedirect(req, res, next) {
  if (env.nodeEnv !== "production" || !env.serveFrontend) {
    next();
    return;
  }

  const canonicalHost = getCanonicalSiteHostname();
  if (!canonicalHost || req.hostname === canonicalHost) {
    next();
    return;
  }

  if (req.hostname === `www.${canonicalHost}`) {
    res.redirect(301, `${env.frontendOrigin}${req.originalUrl}`);
    return;
  }

  next();
}
