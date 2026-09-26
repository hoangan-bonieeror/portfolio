import type { PersonalProject } from "./types";

/**
 * ============================================================
 *  PERSONAL PROJECTS — edit this file to update your portfolio
 * ============================================================
 *
 * Each entry becomes a card in the Projects section and a detail
 * panel (with overview, goal, milestones and progress) at
 * #/projects/<slug>.
 *
 * Quick reference:
 *   status     "planning" | "in-progress" | "paused" | "shipped"
 *   progress   0–100. Omit it to calculate from milestones.
 *   milestones state: "done" | "active" | "todo"
 *              Optional: date, note, weight (default 1)
 *   featured   true → pinned to the top
 *   hidden     true → not shown on the site
 *
 * The order here is the order on the page (featured ones float up).
 *
 * NOTE: milestone lists and states below are a starting point —
 * adjust them to match where each project really is.
 */
export const personalProjects: PersonalProject[] = [
  {
    slug: "salary-management",
    title: "Salary Management System",
    tagline: "Payroll engine with configurable rules and a 22-table PostgreSQL schema.",
    category: "Backend · Full-stack",
    status: "in-progress",
    featured: true,
    goal:
      "A payroll service where business users define salary rules (deductions, advances, bonuses, insurance) without code changes, and every calculation is traceable.",
    overview: [
      "Payroll looks simple until you meet real policies: different insurance profiles, salary advances, one-off bonuses and deductions that change every year. Hard-coding those rules makes every policy change a deploy.",
      "This project moves the rules into data. A policy engine reads configurable rules from PostgreSQL and computes net pay, so a new rule is a new row — not a new release. Role-based permissions control who can view or change what.",
    ],
    highlights: [
      "Designed a normalized 22-table PostgreSQL schema covering employees, salary components, policies, roles and audit data",
      "Role-based access control modelled in the database (functions ↔ roles) with seeded defaults",
      "Rule-driven calculation engine: net pay = f(basic salary, deductions, advances, bonuses, insurance)",
      "REST API with Express/Node.js, consumed by an Angular admin UI",
    ],
    stack: ["PostgreSQL", "Node.js", "Express", "REST API", "Angular", "TypeScript"],
    milestones: [
      { title: "Domain model & 22-table schema (DDL)", state: "done", weight: 2 },
      { title: "Seed data for functions & roles", state: "done" },
      { title: "Auth & role-based permissions API", state: "active", weight: 2 },
      { title: "Configurable policy / rule engine", state: "active", weight: 3 },
      { title: "Payroll run + payslip endpoints", state: "todo", weight: 2 },
      { title: "Angular admin UI", state: "todo", weight: 2 },
      { title: "Tests, Docker setup & public demo", state: "todo" },
    ],
    nextUp: "Finish the permissions API, then wire the first salary rules into the engine.",
    links: {
      repo: "https://github.com/hoangan-bonieeror",
    },
  },
  {
    slug: "csv-to-database-pipeline",
    title: "CSV to Database Pipeline",
    tagline: "Batch ETL: public CSV → cleaned, typed tables in PostgreSQL.",
    category: "Data Engineering",
    status: "in-progress",
    goal:
      "A repeatable ETL job that downloads a public dataset, validates and cleans it, and loads it into a well-designed relational schema ready for analysis.",
    overview: [
      "The first of three data-engineering projects, each a step up in complexity. It covers the fundamentals every pipeline needs: extraction, cleaning, schema design and idempotent loading.",
      "It started with NYC taxi trip data, but large downloads kept timing out — so I switched to the Our World in Data COVID-19 dataset, which is reliable and still rich enough to model properly.",
    ],
    highlights: [
      "Extraction with retries and clear errors when a download fails",
      "Cleaning and type-casting with pandas (dates, nulls, country codes)",
      "Schema designed for analysis rather than a single flat table",
      "Loads through SQLAlchemy so the same code targets SQLite locally and PostgreSQL",
    ],
    stack: ["Python", "pandas", "SQLAlchemy", "PostgreSQL", "SQLite"],
    milestones: [
      { title: "Project structure & architecture plan", state: "done" },
      { title: "Extract step (switched dataset to OWID COVID-19)", state: "done" },
      { title: "Clean & transform with pandas", state: "active", weight: 2 },
      { title: "Schema design & load into PostgreSQL", state: "todo", weight: 2 },
      { title: "Analysis queries & README write-up", state: "todo" },
      { title: "Stretch: scheduled runs with cron", state: "todo" },
    ],
    nextUp: "Finish the cleaning rules, then design the target tables.",
    links: {
      repo: "https://github.com/hoangan-bonieeror",
    },
  },
  {
    slug: "api-data-ingestion-pipeline",
    title: "API Data Ingestion Pipeline",
    tagline: "Scheduled, incremental ingestion from the OpenWeatherMap API.",
    category: "Data Engineering",
    status: "in-progress",
    goal:
      "A scheduled pipeline that pulls weather data from a third-party API, stores only what's new, and answers questions through SQL and a small dashboard.",
    overview: [
      "Project two moves from files to APIs. The interesting problems are the ones real services have: rate limits, partial failures, and not inserting the same reading twice.",
      "Data is fetched on a schedule, loaded incrementally, and then summarised with SQL queries that feed a simple dashboard.",
    ],
    highlights: [
      "Incremental loading — only new readings are inserted",
      "Handles API errors and rate limits with retries and backoff",
      "Data model for locations and time-series readings",
      "Stretch goal: automated data-quality checks",
    ],
    stack: ["Python", "Requests", "SQLite", "PostgreSQL", "SQL"],
    milestones: [
      { title: "Project structure & architecture plan", state: "done" },
      { title: "API client with retries", state: "active" },
      { title: "Data model & incremental load", state: "todo", weight: 2 },
      { title: "Scheduling", state: "todo" },
      { title: "SQL insights & dashboard", state: "todo" },
      { title: "Stretch: data-quality checks", state: "todo" },
    ],
    nextUp: "Finish the API client, then design the readings table.",
    links: {
      repo: "https://github.com/hoangan-bonieeror",
    },
  },
  {
    slug: "airflow-end-to-end-pipeline",
    title: "End-to-End Pipeline with Airflow",
    tagline: "Orchestrated pipeline with Apache Airflow — the capstone of the series.",
    category: "Data Engineering",
    status: "planning",
    goal:
      "Combine what I learn in the first two pipelines into one orchestrated workflow with Airflow DAGs, monitoring and a documented architecture.",
    overview: [
      "The third project in the series. Instead of scripts run by hand or cron, each step becomes an Airflow task with dependencies, retries and visible run history.",
    ],
    highlights: [
      "DAG-based orchestration with retries and alerts",
      "Reuses the extract/transform/load patterns from projects one and two",
      "Architecture diagram and runbook in the repo",
    ],
    stack: ["Python", "Apache Airflow", "PostgreSQL", "Docker"],
    milestones: [
      { title: "Folder structure & architecture plan", state: "done" },
      { title: "Local Airflow environment", state: "todo" },
      { title: "First DAG: extract → load", state: "todo", weight: 2 },
      { title: "Transform, tests & monitoring", state: "todo", weight: 2 },
      { title: "Write-up & diagram", state: "todo" },
    ],
    nextUp: "Starts after the API ingestion pipeline is done.",
  },
  {
    slug: "coco-studio",
    title: "Coco Studio",
    tagline: "Showcase site + admin CMS with draft → publish workflow.",
    category: "Full-stack · CMS",
    status: "in-progress",
    goal:
      "A two-sided platform: a public showcase for an interior studio's clients, and a secure admin portal to write, stage and publish content.",
    overview: [
      "Clients see a clean landing page and blog. Behind it, the studio's team uses an admin portal to draft articles, preview them, and publish when ready.",
      "The core backend work is the content model and the draft/publish staging, so unfinished content never leaks to the public site.",
    ],
    highlights: [
      "Custom CMS with draft, staged and published states",
      "Authenticated admin API separated from the public read API",
      "SQL content model for posts, media and authors",
    ],
    stack: ["Node.js", "Express", "SQL", "Angular"],
    milestones: [
      { title: "Content model & database", state: "done" },
      { title: "Admin API: posts CRUD", state: "active", weight: 2 },
      { title: "Draft / publish staging", state: "todo", weight: 2 },
      { title: "Public showcase & blog", state: "todo" },
      { title: "Deploy", state: "todo" },
    ],
    nextUp: "Finish the admin CRUD endpoints.",
  },
];
