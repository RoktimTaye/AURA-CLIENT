import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  plugins: [
    tanstackStart({
      server: { entry: "src/server.ts" },
    }),
    react(),
    tailwindcss(),
    tsconfigPaths(),
    process.env.NODE_ENV === "production" ? cloudflare() : null,
  ],
  // Server Block 
  server: {
    proxy: {
      '/api': {
        target: 'http//localhost:5173',
        changeOrigin: true,
        rewrite: (path) =>path.replace(/^\/api/, '')
      },
    },
  },
});
