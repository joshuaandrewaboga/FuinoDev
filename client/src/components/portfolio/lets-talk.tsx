import { useState } from "react";
import {
  Check,
  ArrowUpRight,
  MessageSquare,
  Code2,
  GraduationCap,
  Layers,
} from "lucide-react";
const services = [
  {
    name: "Private coaching",
    Icon: MessageSquare,
    intro: "Focused guidance for your next step.",
    features: [
      "One-to-one sessions",
      "Code and career guidance",
      "Flexible scheduling",
    ],
  },
  {
    name: "PERN stack training",
    Icon: GraduationCap,
    intro: "Learn by building a complete application.",
    features: [
      "PostgreSQL, Express, React, Node.js",
      "Hands-on project practice",
      "Curriculum matched to your level",
    ],
  },
  {
    name: "Web development",
    Icon: Code2,
    intro: "Turn your idea into a web experience.",
    features: [
      "Responsive interfaces",
      "API and database integration",
      "Scope tailored to your project",
    ],
  },
  {
    name: "Software development",
    Icon: Layers,
    intro: "Build software around your workflow.",
    features: [
      "Custom application development",
      "Architecture and integrations",
      "Collaborative project planning",
    ],
  },
];
export function LetsTalk({ email }: { email: string }) {
  const [service, setService] = useState(services[0].name);
  const [hours, setHours] = useState(1);
  const [custom, setCustom] = useState(false);
  const [range, setRange] = useState("80k–100k");
  const [currency, setCurrency] = useState("PHP");
  const [period, setPeriod] = useState("per month");
  return (
    <>
      <div className="page-heading simple-page-heading">
        <h1>Let’s talk</h1>
        <p>Choose how we can work together.</p>
      </div>
      <div className="pricing-grid">
        {services.map(({ name, Icon, intro, features }) => (
          <article
            key={name}
            className={`pricing-card ${service === name ? "selected" : ""}`}
          >
            <div className="pricing-cap">
              <Icon size={24} strokeWidth={1.5} />
              <h2>{name}</h2>
            </div>
            <div className="pricing-body">
              <p className="pricing-amount">
                ₱5,000<span>per hour</span>
              </p>
              <p className="pricing-intro">{intro}</p>
              <ul>
                {features.map((feature) => (
                  <li key={feature}>
                    <Check size={16} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                className="primary-button"
                aria-pressed={service === name}
                onClick={() => setService(name)}
              >
                {service === name ? "Selected" : "Choose service"}
                <ArrowUpRight size={16} />
              </button>
            </div>
          </article>
        ))}
      </div>
      <form
        className="inquiry-form"
        onSubmit={(event) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);
          const pricing = custom
            ? `Proposed salary / budget: ${currency} ${range} ${period} (for discussion)`
            : `Hours: ${hours}\nEstimated fee: PHP ${(
                hours * 5000
              ).toLocaleString()} at PHP 5,000/hour`;
          const body = `Name: ${form.get("name")}\nEmail: ${form.get(
            "email"
          )}\nOrganization: ${form.get(
            "organization"
          )}\nService: ${service}\n${pricing}\nTimeline: ${form.get(
            "timeline"
          )}\n\nGoals and details:\n${form.get("details")}`;
          window.location.href = `mailto:${email}?subject=${encodeURIComponent(
            `${service} inquiry`
          )}&body=${encodeURIComponent(body)}`;
        }}
      >
        <div className="inquiry-heading">
          <span className="eyebrow">YOUR INQUIRY</span>
          <h2>Let’s define your next project</h2>
          <p>
            Tell me what you want to achieve so I can recommend the right scope
            and approach.
          </p>
        </div>
        <div className="inquiry-fields">
          <label className="field">
            <span>Name *</span>
            <input name="name" required maxLength={100} autoComplete="name" />
          </label>
          <label className="field">
            <span>Email *</span>
            <input name="email" type="email" required autoComplete="email" />
          </label>
          <label className="field">
            <span>Company / organization</span>
            <input
              name="organization"
              maxLength={120}
              autoComplete="organization"
            />
          </label>
          <label className="field">
            <span>When would you like to start?</span>
            <input
              name="timeline"
              maxLength={120}
              placeholder="e.g. Next month"
            />
          </label>
          <label className="field">
            <span>Where do you need my expertise?</span>
            <select
              value={service}
              onChange={(event) => setService(event.target.value)}
            >
              {services.map((item) => (
                <option key={item.name}>{item.name}</option>
              ))}
              <option>Custom engagement</option>
            </select>
          </label>
          <label className="field">
            <span>Pricing preference</span>
            <select
              value={custom ? "custom" : "hourly"}
              onChange={(event) => {
                setCustom(event.target.value === "custom");
              }}
            >
              <option value="hourly">Standard · ₱5,000 per hour</option>
              <option value="custom">Propose a salary / budget range</option>
            </select>
          </label>
        </div>
        {custom ? (
          <fieldset className="budget-fields">
            <legend>Your proposed range</legend>
            <div className="inquiry-fields">
              <label className="field">
                <span>Currency</span>
                <select
                  value={currency}
                  onChange={(event) => setCurrency(event.target.value)}
                >
                  <option>PHP</option>
                  <option>USD</option>
                  <option>EUR</option>
                  <option>GBP</option>
                </select>
              </label>
              <label className="field">
                <span>Pay period</span>
                <select
                  value={period}
                  onChange={(event) => setPeriod(event.target.value)}
                >
                  <option>per project</option>
                  <option>per hour</option>
                  <option>per month</option>
                  <option>per year</option>
                </select>
              </label>
              <label className="field">
                <span>Salary / budget range</span>
                <select
                  value={range}
                  onChange={(event) => setRange(event.target.value)}
                >
                  <option>Below 80k</option>
                  <option>80k–100k</option>
                  <option>100k–200k</option>
                  <option>200k–300k</option>
                  <option>300k and above</option>
                  <option>Open to discussion</option>
                </select>
              </label>
            </div>
            <p id="budget-help">
              A proposed range for discussion. Final scope and compensation are
              agreed together.
            </p>
          </fieldset>
        ) : (
          <label className="field">
            <span>Hours *</span>
            <input
              type="number"
              min={1}
              max={100}
              required
              value={hours}
              onChange={(event) => setHours(Number(event.target.value))}
            />
          </label>
        )}
        <label className="field">
          <span>
            What challenge should we solve, and what would success look like? *
          </span>
          <textarea
            name="details"
            required
            maxLength={3000}
            rows={5}
            placeholder="Describe your project or learning goals, who it is for, and the outcome you need."
          />
        </label>
        {!custom && (
          <p>
            Estimated fee: ₱{(hours * 5000).toLocaleString()} · ₱5,000 per hour
          </p>
        )}
        <button className="primary-button">
          Prepare email inquiry <ArrowUpRight size={16} />
        </button>
        <small>
          Opens your email app with a draft for you to review and send.
        </small>
      </form>
    </>
  );
}
