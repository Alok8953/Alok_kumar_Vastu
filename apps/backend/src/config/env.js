export const env = {
  port: process.env.PORT || 5000,
  frontendOrigin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
  adminApiKey: process.env.ADMIN_API_KEY || "",
  gmailUser: process.env.GMAIL_USER || "alokkmishra06@gmail.com",
  gmailAppPassword: process.env.GMAIL_APP_PASSWORD || "",
  toEmail: process.env.TO_EMAIL || "alokkmishra06@gmail.com",
  db: {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "",
    name: process.env.DB_NAME || "vastu_db"
  }
};
