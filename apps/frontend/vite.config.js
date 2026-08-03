import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const apiProxy = {
  "/api": {
    target: "http://127.0.0.1:5000",
    changeOrigin: true,
    secure: false,
    timeout: 60_000,
    proxyTimeout: 60_000
  }
};

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: apiProxy
  },
  preview: {
    port: 5173,
    host: true,
    proxy: apiProxy
  }
});
