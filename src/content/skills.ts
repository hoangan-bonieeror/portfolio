import type { SkillGroup } from "./types";

/**
 * Skills grouped by area. Backend comes first on purpose.
 *
 * level: "daily"       → used it in production / every day
 *        "comfortable" → shipped with it, can pick it up quickly
 *        "learning"    → actively learning it now
 *
 * icon: optional key from src/components/SkillIcon.tsx
 */
export const skillGroups: SkillGroup[] = [
  {
    id: "backend",
    title: "Backend & APIs",
    blurb: "Where I spend most of my time.",
    skills: [
      { name: "Python", level: "daily", icon: "python" },
      { name: "Flask", level: "daily", icon: "flask" },
      { name: "REST API design", level: "daily" },
      { name: "Node.js", level: "comfortable", icon: "node" },
      { name: "Express", level: "comfortable", icon: "express" },
      { name: "C++", level: "comfortable", icon: "cplusplus" },
    ],
  },
  {
    id: "data",
    title: "Data & Databases",
    blurb: "Schemas, SQL and moving data around safely.",
    skills: [
      { name: "PostgreSQL", level: "daily", icon: "postgresql" },
      { name: "SQL & schema design", level: "daily" },
      { name: "pandas", level: "comfortable", icon: "pandas" },
      { name: "SQLAlchemy", level: "comfortable", icon: "sqlalchemy" },
      { name: "SQLite", level: "comfortable", icon: "sqlite" },
      { name: "ETL pipelines", level: "learning" },
      { name: "Apache Airflow", level: "learning", icon: "airflow" },
    ],
  },
  {
    id: "systems",
    title: "Systems & Hardware",
    blurb: "Software that talks to the physical world.",
    skills: [
      { name: "ROS2", level: "comfortable", icon: "ros" },
      { name: "SLAM & Nav2", level: "comfortable" },
      { name: "Raspberry Pi", level: "daily", icon: "raspberrypi" },
      { name: "GPIO & sensors", level: "daily" },
      { name: "Linux", level: "daily", icon: "linux" },
    ],
  },
  {
    id: "frontend",
    title: "Frontend & Tools",
    blurb: "Enough to ship the whole feature.",
    skills: [
      { name: "Angular", level: "daily", icon: "angular" },
      { name: "TypeScript", level: "daily", icon: "typescript" },
      { name: "React", level: "comfortable", icon: "react" },
      { name: "Git", level: "daily", icon: "git" },
    ],
  },
];
