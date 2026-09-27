# An Nguyen — Portfolio v2

> A Backend Developer portfolio designed as a **friendly, living API**.

**Live:** https://hoangan-bonieeror.github.io/portfolio/

Every section is an "endpoint" (`GET /v1/about`, `GET /v1/projects`, `POST /v1/contact`…).
Visitors read a clean **Preview** by default and can flip any panel to **JSON** — which is generated
from the same content files that drive the page. A small 3D scene in the hero shows the kind of
system I build: a dashboard, an API, a PostgreSQL database and a factory robot, with data packets
flowing between them.

## Highlights

- **Config-driven content** — all text, projects, milestones and progress live in `src/content/`. No component edits needed.
- **Project tracker** — each personal project has status, goal, overview, weighted milestones and auto-calculated progress, plus a deep-linkable detail panel (`#/projects/<slug>`).
- **3D UI** — React Three Fiber hero scene (lazy-loaded, paused off-screen), CSS 3D tilt cards with depth layers and glare.
- **Friendly & accessible** — light/dark theme (follows system), keyboard navigation, skip link, focus styles, `prefers-reduced-motion` support, WebGL fallback, mobile-first layout.
- **Fast first paint** — the 3D engine loads in a separate chunk after the text.

## Tech stack

React 19 · TypeScript · Vite · Tailwind CSS v4 · Motion · Three.js / React Three Fiber / drei · lucide-react · react-icons · GitHub Pages

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000/portfolio/
npm run build      # type-check + production build into dist/
npm run preview    # serve the production build locally
npm run deploy     # build and publish dist/ to the gh-pages branch
npm run og         # regenerate the social preview image (public/og.png)
```

## Updating content

Everything you'll want to change is in **`src/content/`**:

| File | What it controls |
| --- | --- |
| `profile.ts` | Name, role, roles you're open to, headline, About text, facts, principles, email, résumé link, social links |
| `skills.ts` | Skill groups, each skill's level (`daily` / `comfortable` / `learning`) and optional logo |
| `projects.ts` | **Personal projects** — status, progress, goal, overview, milestones, stack, links |
| `work.ts` | Jobs and selected professional projects |
| `types.ts` | The shape of all of the above (read this for every available field) |

Tips:

- Wrap a phrase in `*asterisks*` in the headline or About paragraphs to highlight it.
- Set `resumeUrl: "resume.pdf"` in `profile.ts` and drop `resume.pdf` into `public/` to show a download button.
- The hero shows an illustrated avatar in the middle. To use your photo instead, put a square image
  (e.g. `avatar.jpg`, at least 420×420) in `public/` and set `avatarUrl: "avatar.jpg"` in `profile.ts`.
- Add a logo for a skill by adding its key to `src/components/SkillIcon.tsx` (icons come from [Simple Icons via react-icons](https://react-icons.github.io/react-icons/icons/si/)).

### Adding or updating a personal project

Add an object to the `personalProjects` array in `src/content/projects.ts`:

```ts
{
  slug: "my-new-project",            // unique, lowercase-with-dashes → #/projects/my-new-project
  title: "My New Project",
  tagline: "One line shown on the card.",
  category: "Backend",
  status: "in-progress",             // "planning" | "in-progress" | "paused" | "shipped"
  // progress: 60,                   // optional — omit to calculate from milestones
  goal: "What done looks like.",
  overview: ["Paragraph one.", "Paragraph two."],
  highlights: ["Interesting engineering detail"],
  stack: ["Python", "PostgreSQL"],
  milestones: [
    { title: "Design schema", state: "done", date: "2026-08" },
    { title: "Build API", state: "active", weight: 3, note: "Auth first" },
    { title: "Deploy", state: "todo" },
  ],
  nextUp: "What you're doing next.",
  startedAt: "2026-08",
  updatedAt: "2026-09",
  links: { repo: "https://github.com/...", demo: "", docs: "" },
  featured: false,                   // true → pinned first, wider card
  hidden: false,                     // true → hide without deleting
}
```

**How progress is calculated** (when `progress` is not set): each milestone has a `weight`
(default 1). `done` milestones earn their full weight, `active` ones earn half. A project with
status `shipped` shows 100%.

While `npm run dev` is running, the browser console warns about content mistakes TypeScript
can't catch — duplicate slugs, progress outside 0–100, a "shipped" project with unfinished
milestones, and so on.

## Social preview image

When the link is shared (LinkedIn, Slack, X…), `public/og.png` is shown. It's generated from the
real content, so after editing `src/content/profile.ts` or `skills.ts` run:

```bash
npm run og       # needs Chrome or Edge installed (or set CHROME_PATH)
npm run deploy
```

LinkedIn caches previews — paste your URL into the
[LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/) once after deploying.

## Performance & the 3D scene

- The hero centres the **avatar**, with the systems I work with (dashboard, Flask API, PostgreSQL,
  ROS2 robot) orbiting around it.
- The hero first paints a lightweight **CSS scene**. The **3D scene** (Three.js) loads only after the
  page has loaded and the visitor starts interacting — or after ~3 s on desktop / ~8 s on phones —
  then fades in.
- Phones, devices without WebGL, and anything with **Data Saver** on or low power (≤ 4 cores or
  ≤ 3 GB RAM) keep the CSS scene.
- The 3D render loop pauses when the hero is off-screen or the tab is hidden.
- Fonts are self-hosted (`@fontsource-variable/*`) and the two above-the-fold files are preloaded.
- Testing: add `?3d=on` or `?3d=off` to the URL to force either version.

## Project structure

```
public/
  404.html            Friendly "endpoint not found" page for GitHub Pages
  favicon.svg
src/
  content/            ← edit these to update the site
  components/
    Hero.tsx          Centred avatar, orbit scene (CSS → 3D), headline and CTAs
    Avatar.tsx        Illustrated avatar (or your photo via profile.avatarUrl)
    HeroScene.tsx     React Three Fiber orbit scene around the avatar
    HeroFallback.tsx  CSS 3D scene (first paint, and low-power fallback)
    OgCard.tsx        1200×630 social preview card rendered at #/og
    ResponsePanel.tsx Preview / JSON "API response" frame
    TiltCard.tsx      3D tilt card with glare
    Projects.tsx      Filterable personal project cards
    ProjectDrawer.tsx Project detail: goal, progress, milestones, JSON
    About / Skills / Experience / Contact / Nav / Footer
  lib/hooks.ts        Theme, hash routing, media queries, scroll spy
  lib/scene3d.ts      When/whether to start the 3D scene
scripts/
  og.mjs              Captures public/og.png
  index.css           Design tokens (light + dark) and utilities
```

## Deployment

The site is served from `https://hoangan-bonieeror.github.io/portfolio/`, so `vite.config.ts`
sets `base: "/portfolio/"`. `npm run deploy` builds and pushes `dist/` to the `gh-pages` branch.
GitHub Pages serves `public/404.html` for unknown URLs automatically.

## Presenting this project

- **Pin the repo** on your GitHub profile and set the repo's website field to the live URL.
- **Résumé line:** "Designed and built a config-driven portfolio in React/TypeScript with a Three.js scene, where each section mirrors a REST endpoint and project progress is computed from weighted milestones."
- **In interviews,** open a project panel and flip to **JSON** — it's a quick way to talk about data modelling, and it shows the site is built on typed content rather than hard-coded markup.
- **Keep projects honest and current.** Updating `updatedAt` and ticking off milestones every week or two shows momentum, which recruiters notice.
- Add a screenshot or short GIF of the hero to the top of this README once deployed.
