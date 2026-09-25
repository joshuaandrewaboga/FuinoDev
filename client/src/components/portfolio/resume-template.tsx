import { Download } from "lucide-react";
export function ResumeTemplate() {
  return (
    <>
      <div className="page-heading simple-page-heading no-print">
        <h1>Resume template</h1>
        <p>A filled chronological example you can use as a guide.</p>
      </div>
      <div className="resume-toolbar no-print">
        <span>FICTIONAL SAMPLE · NEWEST FIRST</span>
        <button className="primary-button" onClick={() => window.print()}>
          <Download size={16} />
          Print / Save PDF
        </button>
      </div>
      <article className="resume-paper sample-resume">
        <div className="resume-header">
          <p className="sample-label">SAMPLE RESUME · FICTIONAL DETAILS</p>
          <h2>John Dela Cruz</h2>
          <h3>Computer Engineer</h3>
          <p>Quezon City, Philippines · john.delacruz@example.com</p>
          <p>Portfolio: example.com · +63 900 000 0000</p>
        </div>
        <section>
          <h4>PROFILE</h4>
          <p>
            Computer engineering graduate with experience developing web
            applications and embedded systems. Interested in building dependable
            software, solving technical problems, and collaborating across
            product teams.
          </p>
        </section>
        <section>
          <h4>EXPERIENCE</h4>
          <div className="resume-entry">
            <div>
              <h3>Software Engineer</h3>
              <strong>Example Technology Company · Quezon City</strong>
              <ul>
                <li>
                  Developed React interfaces and Node.js services for an
                  internal operations platform.
                </li>
                <li>
                  Created PostgreSQL data models and automated tests for core
                  workflows.
                </li>
                <li>
                  Collaborated with designers and engineers to review and
                  release improvements.
                </li>
              </ul>
            </div>
            <small>July 2024 — Present</small>
          </div>
          <div className="resume-entry">
            <div>
              <h3>Engineering Intern</h3>
              <strong>Sample Systems Laboratory · Quezon City</strong>
              <ul>
                <li>
                  Built a sensor monitoring prototype and documented its setup.
                </li>
                <li>
                  Assisted with hardware testing, troubleshooting, and data
                  analysis.
                </li>
              </ul>
            </div>
            <small>June 2023 — August 2023</small>
          </div>
        </section>
        <section>
          <h4>EDUCATION</h4>
          <div className="resume-entry">
            <div>
              <h3>Bachelor of Science in Computer Engineering</h3>
              <strong>University of the Philippines Diliman</strong>
              <p>
                Sample capstone: IoT environmental monitoring system with a web
                dashboard.
              </p>
              <p>
                Relevant coursework: computer architecture, embedded systems,
                networks, and software engineering.
              </p>
            </div>
            <small>2020 — 2024</small>
          </div>
        </section>
        <section>
          <h4>TECHNICAL SKILLS</h4>
          <p>
            <strong>Languages:</strong> JavaScript, TypeScript, Python, C/C++,
            SQL
          </p>
          <p>
            <strong>Web:</strong> React, Node.js, Express, PostgreSQL, REST APIs
          </p>
          <p>
            <strong>Engineering tools:</strong> Git, Linux, Arduino, circuit
            testing
          </p>
        </section>
        <section>
          <h4>PROJECTS</h4>
          <h3>Environmental Monitoring Dashboard</h3>
          <p>
            Connected sensor readings to a responsive dashboard with historical
            charts and threshold alerts.
          </p>
        </section>
      </article>
    </>
  );
}
