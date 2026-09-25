import { LEARNED_STACKS } from "./toolkit";
const LEGACY_STACKS =
  "Frontend: React, TypeScript, Tailwind CSS\nBackend: Node.js, REST APIs\nWorkflow: Git, GitHub, Refine, Vite";
function addOperatingSystems(stacks: string) {
  const lines = stacks.split("\n");
  const index = lines.findIndex((line) =>
    /^Operating Systems\s*\/\s*Environments:/i.test(line)
  );
  if (index < 0)
    return `${stacks}\nOperating Systems / Environments: Linux, Ubuntu`;
  const tools = lines[index]
    .slice(lines[index].indexOf(":") + 1)
    .split(",")
    .map((tool) => tool.trim());
  for (const tool of ["Linux", "Ubuntu"])
    if (
      !tools.some((existing) => existing.toLowerCase() === tool.toLowerCase())
    )
      tools.push(tool);
  lines[index] = `Operating Systems / Environments: ${tools.join(", ")}`;
  return lines.join("\n");
}
export type Project = {
  id: string;
  name: string;
  description: string;
  logo: string;
  url: string;
  category: string;
};
export type Certificate = {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url: string;
  image: string;
};
export type Post = {
  id: string;
  title: string;
  topic: string;
  lesson: string;
  takeaway: string;
  date: string;
  published: boolean;
  author?: string;
};
export type Recommendation = {
  status?: "pending" | "accepted" | "rejected";
  id: string;
  name: string;
  relationship: string;
  message: string;
  date: string;
  published: boolean;
};
export type Experience = {
  id: string;
  role: string;
  organization: string;
  start: string;
  end: string;
  description: string;
  kind: string;
};
export type Portfolio = {
  toolkitVersion?: number;
  identityVersion?: number;
  profile: {
    name: string;
    role: string;
    bio: string;
    email: string;
    github: string;
    linkedin: string;
    instagram: string;
    location: string;
    available: boolean;
    stacks: string;
  };
  projects: Project[];
  posts: Post[];
  experience: Experience[];
  recommendations: Recommendation[];
  certificates: Certificate[];
};
export const initialPortfolio: Portfolio = {
  toolkitVersion: 3,
  identityVersion: 1,
  profile: {
    name: "Joshua Andrew Aboga",
    role: "Full Stack Software Developer",
    bio: "I turn ideas into thoughtful digital experiences. Building for the web, learning along the way, and caring about the little details.",
    email: "aboga.joshuaandrewdeversol@gmail.com",
    github: "https://github.com/joshuaandrewaboga",
    linkedin: "",
    instagram: "",
    location: "",
    available: true,
    stacks: LEARNED_STACKS,
  },
  projects: [],
  posts: [],
  experience: [],
  recommendations: [],
  certificates: [],
};
export const STORAGE_KEY = "fuinodev-portfolio-v1";
export function loadPortfolio(): Portfolio {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (
        data.profile &&
        Array.isArray(data.projects) &&
        Array.isArray(data.posts) &&
        Array.isArray(data.experience)
      )
        return {
          ...data,
          identityVersion: 1,
          toolkitVersion: 3,
          certificates: Array.isArray(data.certificates)
            ? data.certificates
            : [],
          recommendations: Array.isArray(data.recommendations)
            ? data.recommendations
            : [],
          profile: {
            ...initialPortfolio.profile,
            ...data.profile,
            ...(data.identityVersion !== 1
              ? {
                  github: initialPortfolio.profile.github,
                  name: initialPortfolio.profile.name,
                }
              : {}),
            stacks:
              (data.toolkitVersion || 0) < 2 ||
              !data.profile.stacks ||
              data.profile.stacks === LEGACY_STACKS
                ? LEARNED_STACKS
                : (data.toolkitVersion || 0) < 3
                ? addOperatingSystems(data.profile.stacks)
                : data.profile.stacks,
          },
        };
    }
  } catch {
    /* A fresh portfolio remains usable when browser storage is unavailable. */
  }
  return initialPortfolio;
}
export function safeUrl(value: string) {
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) ? url.href : undefined;
  } catch {
    return undefined;
  }
}
