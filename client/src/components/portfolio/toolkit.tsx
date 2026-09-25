import { useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { Pause, Play } from "lucide-react";
import { TechIcon } from "@/components/tech-icon";

const overviewGroups = [
  {
    name: "Frontend",
    tools: ["TypeScript", "React", "Next.js", "Tailwind CSS", "Refine"],
  },
  {
    name: "Backend & data",
    tools: ["Node.js", "Express.js", "PostgreSQL", "Prisma", "REST API"],
  },
  { name: "Quality & security", tools: ["Zod", "JWT", "Vitest", "Playwright"] },
  {
    name: "Delivery & workflow",
    tools: ["Git", "GitHub", "Docker", "GitHub Actions", "AWS"],
  },
];

export function Toolkit({
  stacks,
  overview = false,
}: {
  stacks: string;
  overview?: boolean;
}) {
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(() => {
    if (overview) return true;
    try {
      return localStorage.getItem("fuinodev-toolkit-motion") === "true";
    } catch {
      return false;
    }
  });
  const animated = enabled && !reduced;
  const groups = stacks
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const split = line.indexOf(":");
      return {
        name: split >= 0 ? line.slice(0, split) : "Tools",
        tools: (split >= 0 ? line.slice(split + 1) : line)
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      };
    });
  const availableTools = new Set(groups.flatMap((group) => group.tools));
  const highlights = overviewGroups
    .map((group) => ({
      ...group,
      tools: group.tools.filter((tool) => availableTools.has(tool)),
    }))
    .filter((group) => group.tools.length > 0);
  const shown = overview
    ? highlights.length
      ? highlights
      : groups
          .slice(0, 4)
          .map((group) => ({ ...group, tools: group.tools.slice(0, 5) }))
    : groups;
  return (
    <div className="toolkit-component">
      <div className="motion-toolbar">
        <button
          type="button"
          role="switch"
          aria-checked={animated}
          disabled={reduced}
          className="motion-switch"
          onClick={() => {
            setEnabled(!enabled);
            if (!overview)
              try {
                localStorage.setItem(
                  "fuinodev-toolkit-motion",
                  String(!enabled)
                );
              } catch {
                /* Motion still works for this visit. */
              }
          }}
        >
          <span className={`switch-track ${animated ? "on" : ""}`}>
            <span />
          </span>
          {animated ? <Pause size={15} /> : <Play size={15} />}
          <span>{overview ? "Animate toolkit" : "Animate tools"}</span>
        </button>
        {reduced && (
          <span className="motion-hint">
            Reduced motion is enabled on your device.
          </span>
        )}
      </div>
      <div className={`stack-groups ${animated ? "is-animated" : ""}`}>
        {shown.map((group, row) => {
          const copies = Math.max(
            1,
            Math.ceil(9 / Math.max(group.tools.length, 1))
          );
          const badges = (duplicate: boolean) => (
            <div
              className="marquee-sequence"
              aria-hidden={duplicate || undefined}
            >
              {Array.from({ length: copies }, (_, copy) =>
                group.tools.map((name, index) => (
                  <span
                    aria-hidden={copy > 0 || undefined}
                    className={`tech-tag tech-${(row + index) % 5}`}
                    key={`${copy}-${index}`}
                  >
                    <TechIcon name={name} />
                    {name}
                  </span>
                ))
              )}
            </div>
          );
          return (
            <div className="stack-group" key={`${group.name}-${row}`}>
              <span className="stack-label">{group.name}</span>
              {animated ? (
                <div className="marquee-window">
                  <div className={`marquee-track ${row % 2 ? "reverse" : ""}`}>
                    {badges(false)}
                    {badges(true)}
                  </div>
                </div>
              ) : (
                <div className="stack-tags">
                  {group.tools.map((name, index) => (
                    <span
                      className={`tech-tag tech-${(row + index) % 5}`}
                      key={`${name}-${index}`}
                    >
                      <TechIcon name={name} />
                      {name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
