import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { validateContent } from "./content";
// Self-hosted variable fonts (no request to Google Fonts before first paint).
import "@fontsource-variable/inter/wght.css";
import "@fontsource-variable/bricolage-grotesque/opsz.css";
import "@fontsource-variable/jetbrains-mono/wght.css";
import "./index.css";

// While developing, flag mistakes in src/content/*.ts in the browser console.
if (import.meta.env.DEV) {
  const problems = validateContent();
  if (problems.length) {
    console.warn(`[content] ${problems.length} problem(s) in src/content:\n- ${problems.join("\n- ")}`);
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
