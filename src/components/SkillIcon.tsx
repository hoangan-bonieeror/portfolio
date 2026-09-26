import type { IconType } from "react-icons";
import {
  SiAngular,
  SiApacheairflow,
  SiCplusplus,
  SiDocker,
  SiExpress,
  SiFlask,
  SiGit,
  SiLinux,
  SiNodedotjs,
  SiPandas,
  SiPostgresql,
  SiPython,
  SiRaspberrypi,
  SiReact,
  SiRos,
  SiSqlalchemy,
  SiSqlite,
  SiTypescript,
} from "react-icons/si";

/**
 * Logos available to skills.ts via the `icon` field.
 * Add more from https://react-icons.github.io/react-icons/icons/si/
 */
export const skillIcons: Record<string, IconType> = {
  angular: SiAngular,
  airflow: SiApacheairflow,
  cplusplus: SiCplusplus,
  docker: SiDocker,
  express: SiExpress,
  flask: SiFlask,
  git: SiGit,
  linux: SiLinux,
  node: SiNodedotjs,
  pandas: SiPandas,
  postgresql: SiPostgresql,
  python: SiPython,
  raspberrypi: SiRaspberrypi,
  react: SiReact,
  ros: SiRos,
  sqlalchemy: SiSqlalchemy,
  sqlite: SiSqlite,
  typescript: SiTypescript,
};

export function SkillIcon({ name, className = "h-4 w-4" }: { name?: string; className?: string }) {
  const Icon = name ? skillIcons[name] : undefined;
  if (!Icon) return <span className="h-2 w-2 rounded-full bg-current opacity-60" aria-hidden />;
  return <Icon className={className} aria-hidden />;
}
