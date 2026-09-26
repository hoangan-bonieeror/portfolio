import type { Job, WorkProject } from "./types";

/** Your jobs, newest first. */
export const jobs: Job[] = [
  {
    role: "Software Developer",
    company: "Unitec Solution Vietnam",
    companyNote: "Japan-affiliated industrial automation company",
    location: "Vietnam",
    start: "Jun 2023",
    end: "Nov 2025",
    summary:
      "Built the backend services, databases and dashboards behind factory automation — robots, sensors and biometric devices.",
    bullets: [
      "Built REST APIs in Python/Flask that let operators control, monitor and route AMR/AGV fleets from a web dashboard.",
      "Designed relational schemas and queries for factory-wide environmental monitoring, keeping logs available 24/7.",
      "Wrote low-latency Python firmware on Raspberry Pi 5 to read sensors and drive GPIO alert hardware.",
      "Implemented SLAM mapping and Nav2 navigation in ROS2 (Python and C++) for collision-free robot routes.",
      "Integrated fingerprint scanners into a canteen system backed by PostgreSQL, cutting queue time at meal distribution.",
    ],
  },
];

/** Selected professional projects — written from the backend angle. */
export const workProjects: WorkProject[] = [
  {
    slug: "amr-fleet",
    title: "AMR Fleet Management & Navigation",
    summary: "Control API and dashboard for autonomous mobile robots.",
    contributions: [
      "Flask API bridging the web dashboard and ROS2 robot nodes",
      "SLAM mapping + Nav2 routes to client-defined points",
      "Angular dashboard for live robot status and commands",
    ],
    stack: ["Python", "Flask", "ROS2", "C++", "SLAM", "Nav2", "Angular"],
    kind: "robot",
  },
  {
    slug: "env-monitoring",
    title: "Real-Time Environmental Monitoring",
    summary: "Sensor nodes → REST API → live charts with alarm thresholds.",
    contributions: [
      "Ingestion API for temperature/humidity readings from many Raspberry Pi nodes",
      "Schema and queries for time-series logs across factory areas",
      "Configurable alarm thresholds and live-updating charts",
    ],
    stack: ["Python", "Flask", "Raspberry Pi", "REST API", "Angular"],
    kind: "dashboard",
  },
  {
    slug: "canteen-biometric",
    title: "Canteen Meals & Fingerprint Verification",
    summary: "Meal registration service with biometric identity checks.",
    contributions: [
      "PostgreSQL model for workers, registrations and meal distribution",
      "Fingerprint verification flow so every worker gets the right meal",
      "Admin website to manage registrations",
    ],
    stack: ["Python", "Flask", "PostgreSQL", "Angular"],
    kind: "fingerprint",
  },
  {
    slug: "agv-routes",
    title: "AGV Route Planning & Control",
    summary: "Clients define points and routes; the API dispatches AGVs.",
    contributions: [
      "API for storing coordinate points and routes on facility grids",
      "Interactive route editor for industrial clients",
    ],
    stack: ["Python", "Flask", "Angular"],
    kind: "route",
  },
  {
    slug: "led-alerts",
    title: "Factory LED & Audio Alert System",
    summary: "Embedded alerting for out-of-range temperature and humidity.",
    contributions: [
      "Python firmware on Raspberry Pi 5 driving a red/yellow/green LED board",
      "Audible alarm on low-latency GPIO channels",
    ],
    stack: ["Python", "Raspberry Pi 5", "GPIO"],
    kind: "sensor",
  },
];
