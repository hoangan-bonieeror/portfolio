import type { Profile } from "./types";

/**
 * Who you are. Everything in the hero, About and Contact sections
 * comes from here.
 */
export const profile: Profile = {
  name: "An Nguyen",
  role: "Backend Developer",
  openTo: ["Software Developer", "Full-Stack Developer"],
  available: true,
  location: "Pittsburg, CA",

  headline: "I build the *backend* that keeps things running.",
  intro:
    "APIs, data models and pipelines — plus 2.5 years of wiring software to real factory hardware. I like systems that are boring in production, in the best way.",

  about: [
    "Hi, I'm An. I spent *2.5 years at Unitec Solution Vietnam* building the software behind industrial automation: Python/Flask services, PostgreSQL databases, and REST APIs that robots, sensors and fingerprint scanners talk to all day.",
    "Most of my work lived in the middle of the stack — taking messy real-world signals (a robot's position, a room's humidity, a worker's fingerprint) and turning them into clean data and reliable endpoints that a dashboard or another service can trust.",
    "Now I'm focused on *backend and data engineering*: designing schemas, building ETL pipelines, and shipping services that are easy to reason about. I'm also happy in a broader Software Developer role — I've built Angular frontends and embedded firmware too.",
  ],

  facts: [
    { label: "Experience", value: "2.5 years" },
    { label: "Main language", value: "Python" },
    { label: "Database", value: "PostgreSQL" },
    { label: "Degree", value: "B.Sc. IT, Sai Gon University" },
  ],

  principles: [
    {
      title: "Data first",
      body: "A good schema makes the rest of the code simpler. I start with the tables, then the endpoints.",
    },
    {
      title: "Built for 24/7",
      body: "Factory software can't go down at 3 a.m. I think about retries, logs and failure paths early.",
    },
    {
      title: "Hardware-aware",
      body: "I've debugged GPIO pins and ROS2 nodes, so I'm comfortable where software meets the physical world.",
    },
  ],

  email: "hoangan726@gmail.com",
  // Put a square photo (e.g. "avatar.jpg") in /public and set it here to replace the illustration.
  avatarUrl: "",
  // Add a link to your résumé PDF (e.g. "resume.pdf" placed in /public) to show a download button.
  resumeUrl: "",

  links: [
    {
      label: "GitHub",
      handle: "hoangan-bonieeror",
      url: "https://github.com/hoangan-bonieeror",
      icon: "github",
    },
    {
      label: "LinkedIn",
      handle: "An Nguyen",
      url: "https://www.linkedin.com/in/tran-hoang-an-nguyen-3168751a6/",
      icon: "linkedin",
    },
  ],
};
