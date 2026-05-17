import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Prefer TS/TSX over legacy emitted .js so source-of-truth edits win.
    extensions: [".mjs", ".mts", ".ts", ".tsx", ".jsx", ".js", ".json"],
  },
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: false,
        // cookie de refresh tiene path /api/auth/ — el proxy debe preservar el path tal cual
      },
      "/media": {
        target: "http://127.0.0.1:8000",
        changeOrigin: false,
      },
    },
  },
});
