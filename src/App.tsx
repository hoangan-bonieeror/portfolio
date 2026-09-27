import { Suspense, lazy } from "react";
import About from "./components/About";
import Contact from "./components/Contact";
import Experience from "./components/Experience";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Nav from "./components/Nav";
import ProjectDrawer from "./components/ProjectDrawer";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import { useProjectRoute, useTheme } from "./lib/hooks";

// Social preview card (#/og), only loaded by the `npm run og` capture script.
const OgCard = lazy(() => import("./components/OgCard"));

export default function App() {
  const { theme, toggle } = useTheme();
  const { slug, open, close } = useProjectRoute();

  if (window.location.hash === "#/og") {
    return (
      <Suspense fallback={null}>
        <OgCard />
      </Suspense>
    );
  }

  return (
    <>
      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-on-accent"
      >
        Skip to content
      </a>
      <Nav theme={theme} onToggleTheme={toggle} />
      <main className="overflow-x-clip">
        <Hero theme={theme} />
        <About />
        <Skills />
        <Projects onOpen={open} />
        <Experience />
        <Contact />
      </main>
      <Footer />
      <ProjectDrawer slug={slug} onClose={close} />
    </>
  );
}
