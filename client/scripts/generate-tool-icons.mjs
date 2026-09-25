import fs from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const collections = {
  logos: require("@iconify-json/logos/icons.json"),
  simple: require("@iconify-json/simple-icons/icons.json"),
};
const entries = {
  TypeScript: "typescript-icon",
  JavaScript: "javascript",
  Java: "java",
  JDK: "java",
  "VB.NET": "simple:visualbasic",
  HTML: "html-5",
  CSS: "css-3",
  React: "react",
  Vite: "vite-icon",
  "Next.js": "nextjs-icon",
  "Tailwind CSS": "tailwindcss-icon",
  Refine: "simple:refine",
  "React Router": "react-router",
  "Framer Motion": "framer",
  "Node.js": "nodejs-icon",
  "Express.js": "express",
  "NestJS / Fastify": ["nestjs", "fastify-icon"],
  "Spring Boot": "spring-icon",
  PostgreSQL: "postgresql",
  MySQL: "mysql-icon",
  "Microsoft Access": "simple:microsoftaccess",
  Prisma: "prisma",
  Drizzle: "drizzle-icon",
  JWT: "jwt-icon",
  "OIDC / OAuth 2.x": ["simple:openid", "oauth"],
  Zod: "zod",
  "React Hook Form": "simple:reacthookform",
  Vitest: "vitest",
  "React Testing Library": "testing-library",
  Playwright: "playwright",
  "Socket.IO": "socket-io",
  WebRTC: "webrtc",
  AWS: "aws",
  "Amazon S3": "aws-s3",
  Cloudinary: "cloudinary-icon",
  Docker: "docker-icon",
  "Kubernetes / AWS ECS": ["kubernetes", "aws-ecs"],
  Terraform: "terraform-icon",
  "GitHub Actions": "github-actions",
  OpenTelemetry: "opentelemetry-icon",
  "Grafana / Datadog": ["grafana", "datadog-icon"],
  Sentry: "sentry-icon",
  Redis: "redis",
  OpenSearch: "opensearch-icon",
  "SQS / Kafka": ["aws-sqs", "kafka-icon"],
  Hardhat: "hardhat-icon",
  "local Ethereum development": "ethereum-color",
  ChatGPT: "openai-icon",
  Codex: "codex",
  CodeRabbit: "coderabbit-icon",
  WebStorm: "webstorm",
  "VS Code": "visual-studio-code",
  "IntelliJ IDEA": "intellij-idea",
  Maven: "maven",
  "Windows Forms": "dotnet",
  Git: "git-icon",
  GitHub: "github-icon",
  npm: "npm-icon",
  Windows: "microsoft-windows-icon",
  Linux: "linux-tux",
  Ubuntu: "ubuntu",
  "Android VM / virtualization": "android-icon",
  "VirtualBox / Android VM concepts": ["simple:virtualbox", "android-icon"],
  Render: "simple:render",
  "AWS-oriented deployment": "aws",
  Arcjet: "custom:arcjet.png",
  Site24x7: "custom:site24x7.ico",
  "Junie AI": "custom:junie.svg",
};
const monochrome = new Set([
  "nextjs-icon",
  "express",
  "fastify-icon",
  "framer",
  "prisma",
  "socket-io",
  "openai-icon",
  "codex",
  "github-icon",
  "kafka-icon",
  "sentry-icon",
  "simple:render",
  "custom:arcjet.png",
]);
const colors = {
  visualbasic: "#512BD4",
  refine: "#0891B2",
  microsoftaccess: "#A4373A",
  openid: "#F78C40",
  reacthookform: "#EC5990",
  virtualbox: "#2F61B4",
  render: "#222222",
};
const output = {};
for (const [tool, value] of Object.entries(entries)) {
  output[tool] = (Array.isArray(value) ? value : [value]).map((key) => {
    if (key.startsWith("custom:"))
      return {
        src: "/tool-icons/" + key.slice(7),
        monochrome: monochrome.has(key),
      };
    const [collection, name] = key.includes(":")
      ? key.split(":")
      : ["logos", key];
    const icon = collections[collection].icons[name];
    if (!icon) throw new Error(`Missing icon: ${key}`);
    const file = `${collection}-${name}.svg`;
    const body = icon.body.replaceAll(
      "currentColor",
      colors[name] || "#343A40"
    );
    fs.writeFileSync(
      `public/tool-icons/${file}`,
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${
        icon.width || collections[collection].width || 24
      } ${icon.height || collections[collection].height || 24}">${body}</svg>\n`
    );
    return { src: "/tool-icons/" + file, monochrome: monochrome.has(key) };
  });
}
fs.writeFileSync(
  "src/lib/tool-logos.json",
  JSON.stringify(output, null, 2) + "\n"
);
console.log(`Generated logo mappings for ${Object.keys(output).length} tools.`);
