import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

/**
 * Preloads the two Latin font files used above the fold (body text and the
 * big headline), so the first paint uses the real fonts sooner.
 */
function preloadFonts(patterns: RegExp[]): Plugin {
  let base = "/";
  return {
    name: "preload-fonts",
    apply: "build",
    configResolved(config) {
      base = config.base;
    },
    transformIndexHtml: {
      order: "post",
      handler(_html, ctx) {
        const files = Object.keys(ctx.bundle ?? {}).filter((f) => f.endsWith(".woff2") && patterns.some((p) => p.test(f)));
        return files.map((f) => ({
          tag: "link",
          attrs: { rel: "preload", href: `${base}${f}`, as: "font", type: "font/woff2", crossorigin: "" },
          injectTo: "head-prepend" as const,
        }));
      },
    },
  };
}

// Deployed to GitHub Pages at https://hoangan-bonieeror.github.io/portfolio/
export default defineConfig({
  base: "/portfolio/",
  plugins: [react(), tailwindcss(), preloadFonts([/inter-latin-wght-normal/, /bricolage-grotesque-latin-opsz-normal/])],
  build: {
    // The 3D engine is loaded lazily in its own chunk (see Hero.tsx).
    chunkSizeWarningLimit: 1200,
  },
});
