import { useState } from "react";
import {
  Braces,
  Database,
  Globe,
  HardHat,
  KeyRound,
  Layers,
  Network,
  Server,
  ShieldCheck,
  TestTube2,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import logoMap from "@/lib/tool-logos.json";

type Logo = { src: string; monochrome: boolean };
const logos: Record<string, Logo[]> = logoMap;
const aliases: Record<string, Logo[]> = {
  NestJS: [logos["NestJS / Fastify"][0]],
  Fastify: [logos["NestJS / Fastify"][1]],
  "OAuth 2.0": [logos["OIDC / OAuth 2.x"][1]],
  "OAuth 2.x": [logos["OIDC / OAuth 2.x"][1]],
  OIDC: [logos["OIDC / OAuth 2.x"][0]],
  Grafana: [logos["Grafana / Datadog"][0]],
  Datadog: [logos["Grafana / Datadog"][1]],
  Kubernetes: [logos["Kubernetes / AWS ECS"][0]],
  "AWS ECS": [logos["Kubernetes / AWS ECS"][1]],
  SQS: [logos["SQS / Kafka"][0]],
  Kafka: [logos["SQS / Kafka"][1]],
};
const concepts: Record<string, LucideIcon> = {
  SQL: Database,
  "REST API": Workflow,
  REST: Workflow,
  bcrypt: KeyRound,
  Argon2: KeyRound,
  Helmet: HardHat,
  CORS: ShieldCheck,
  "rate limiting": ShieldCheck,
  "CSRF protection": ShieldCheck,
  Supertest: TestTube2,
  "Basic TCP/IP": Network,
  DNS: Globe,
  gateways: Network,
  "LAN/network configuration": Network,
  "Client/server": Server,
  monorepo: Workflow,
  "full-stack architecture": Layers,
};
function BrandImage({ logo }: { logo: Logo }) {
  const [failed, setFailed] = useState(false);
  return failed ? (
    <Braces aria-hidden="true" />
  ) : (
    <img
      src={logo.src}
      alt=""
      width={20}
      height={20}
      className={logo.monochrome ? "brand-monochrome" : undefined}
      onError={() => setFailed(true)}
    />
  );
}
/** Brand artwork for products; descriptive symbols for protocols and concepts. */
export function TechIcon({ name }: { name: string }) {
  const brand = logos[name] || aliases[name];
  const Symbol = concepts[name] || Braces;
  return (
    <span className="tech-icon" aria-hidden="true">
      {brand ? (
        brand.map((logo) => <BrandImage key={logo.src} logo={logo} />)
      ) : (
        <Symbol />
      )}
    </span>
  );
}
