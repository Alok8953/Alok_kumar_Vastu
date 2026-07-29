function parseDatabaseUrl(rawUrl) {
  if (!rawUrl) return null;

  try {
    const url = new URL(rawUrl);
    return {
      host: url.hostname,
      port: Number(url.port || 5432),
      user: decodeURIComponent(url.username),
      password: decodeURIComponent(url.password),
      name: url.pathname.replace(/^\//, ""),
      ssl: url.searchParams.get("sslmode") !== "disable",
      skipAutoCreate: true
    };
  } catch {
    return null;
  }
}

const databaseUrl = process.env.DATABASE_URL || "";
const fromUrl = parseDatabaseUrl(databaseUrl);

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: process.env.PORT || 5000,
  frontendOrigin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
  backendPublicUrl: (process.env.BACKEND_PUBLIC_URL || "").replace(/\/$/, ""),
  serveFrontend: process.env.SERVE_FRONTEND === "true",
  adminApiKey: process.env.ADMIN_API_KEY || "",
  resendApiKey: process.env.RESEND_API_KEY || "",
  resendFrom:
    process.env.RESEND_FROM || "Vastu Website <onboarding@resend.dev>",
  gmailUser: process.env.GMAIL_USER || "alokkmishra06@gmail.com",
  gmailAppPassword: process.env.GMAIL_APP_PASSWORD || "",
  toEmail: (process.env.TO_EMAIL || "alokkmishra06@gmail.com").trim(),
  fast2smsApiKey: (process.env.FAST2SMS_API_KEY || "").trim(),
  otpDebug: (process.env.OTP_DEBUG || "").trim().toLowerCase() === "true",
  databaseUrl: databaseUrl || null,
  db: fromUrl || {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "",
    name: process.env.DB_NAME || "vastu_db",
    ssl: process.env.DB_SSL === "true",
    skipAutoCreate: process.env.DB_SKIP_AUTO_CREATE === "true"
  }
};
