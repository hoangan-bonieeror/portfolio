import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Deployed to GitHub Pages at https://hoangan-bonieeror.github.io/portfolio/
export default defineConfig({
  base: "/portfolio/",
  plugins: [react(), tailwindcss()],
  build: {
    // The 3D engine is loaded lazily in its own chunk (see Hero.tsx).
    chunkSizeWarningLimit: 1200,
  },
});
