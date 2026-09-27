/**
 * Captures the social preview image (public/og.png, 1200×630).
 *
 *   npm run og
 *
 * Starts a temporary Vite dev server, opens the hidden #/og card in your
 * installed Chrome (or Edge), and saves a screenshot. Re-run it after you
 * change src/content/profile.ts or skills.ts, then deploy.
 *
 * Uses CHROME_PATH if set; otherwise looks for Chrome, then Edge.
 */
import { chromium } from "playwright-core";
import { createServer } from "vite";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "public", "og.png");
const port = 5178;

const server = await createServer({ root, logLevel: "error", server: { port, strictPort: true, host: "127.0.0.1" } });
await server.listen();

async function launch() {
  const args = ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"];
  if (process.env.CHROME_PATH) return chromium.launch({ executablePath: process.env.CHROME_PATH, args });
  for (const channel of ["chrome", "msedge"]) {
    try {
      return await chromium.launch({ channel, args });
    } catch {
      /* try the next browser */
    }
  }
  throw new Error("No Chrome or Edge found. Install Chrome, or set CHROME_PATH to a Chromium-based browser.");
}

let browser;
try {
  browser = await launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1, colorScheme: "light" });
  await page.goto(`http://127.0.0.1:${port}/portfolio/#/og`, { waitUntil: "networkidle" });
  await page.waitForSelector("body[data-og-ready]", { timeout: 30000 });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: out, clip: { x: 0, y: 0, width: 1200, height: 630 } });
  console.log(`Saved ${path.relative(root, out)}`);
} finally {
  await browser?.close();
  await server.close();
}
