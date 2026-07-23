import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
  server: {
    proxy: {
      "/auth/": { target: "http://localhost:8080", changeOrigin: true },
      "/project/": { target: "http://localhost:8080", changeOrigin: true },
      "/board/": { target: "http://localhost:8080", changeOrigin: true },
      "/task/": { target: "http://localhost:8080", changeOrigin: true },
      "/tag/": { target: "http://localhost:8080", changeOrigin: true },
      "/user/": { target: "http://localhost:8080", changeOrigin: true },
    },
  },
});
