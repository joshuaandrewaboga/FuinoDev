import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router";
import {
  ArrowUpRight,
  Plus,
  FolderOpen,
  BookOpen,
  FileText,
  Layers,
  Github,
  Linkedin,
  Instagram,
  Mail,
  Sun,
  Moon,
  Monitor,
  Menu,
  X,
  Settings2,
  Eye,
  Pencil,
  Trash2,
  Check,
  MessageSquareQuote,
  ChevronRight,
  LayoutDashboard,
  Award,
  Download,
} from "lucide-react";
import { useTheme } from "@/components/refine-ui/theme/theme-provider";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Toolkit } from "@/components/portfolio/toolkit";
import { ProjectCarousel } from "@/components/portfolio/project-carousel";
import {
  CommunityWidget,
  CommunityChat,
  NameGate,
} from "@/components/portfolio/community";
import { Recommendations } from "@/components/portfolio/recommendations";
import { ResumeTemplate } from "@/components/portfolio/resume-template";
import { Wisdom } from "@/components/portfolio/wisdom";
import { LetsTalk } from "@/components/portfolio/lets-talk";
import { Certificates } from "@/components/portfolio/certificates";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  loadPortfolio,
  safeUrl,
  STORAGE_KEY,
  type Portfolio,
  type Project,
  type Post,
  type Experience,
} from "@/lib/portfolio";

const sampleProjects: Project[] = [
  {
    id: "sample-1",
    name: "Your next big idea",
    description:
      "A little curiosity. A useful problem. Something worth building.",
    category: "PROJECT PREVIEW",
    logo: "",
    url: "",
  },
  {
    id: "sample-2",
    name: "Made with intention",
    description:
      "A home for the things you design, develop, and send into the world.",
    category: "PROJECT PREVIEW",
    logo: "",
    url: "",
  },
  {
    id: "sample-3",
    name: "From idea to interface",
    description:
      "Good experiences start with thoughtful details. Show yours here.",
    category: "PROJECT PREVIEW",
    logo: "",
    url: "",
  },
];
const palettes = [
  { name: "Notebook", color: "#62666c" },
  { name: "Ocean", color: "#3280c4" },
  { name: "Sage", color: "#56856c" },
  { name: "Amethyst", color: "#8870be" },
  { name: "Rose", color: "#bf658b" },
];
function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}
function External({
  href,
  children,
  ...rest
}: {
  href: string;
  children: ReactNode;
  className?: string;
  "aria-label"?: string;
}) {
  const url = safeUrl(href);
  return url ? (
    <a href={url} target="_blank" rel="noreferrer" {...rest}>
      {children}
    </a>
  ) : null;
}
export default function Dashboard() {
  const [data, setData] = useState<Portfolio>(loadPortfolio);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const admin = pathname.startsWith("/admin");
  const segment =
    pathname
      .split("/")
      .filter(Boolean)
      .filter((x) => x !== "admin")[0] || "overview";
  const page = [
    "overview",
    "projects",
    "stack",
    "resume",
    "wisdom",
    "settings",
    "recommendations",
    "certificates",
    "talk",
  ].includes(segment)
    ? segment
    : "missing";
  const [modal, setModal] = useState<"project" | "post" | "experience" | null>(
    null
  );
  const [editing, setEditing] = useState<Project | Post | Experience | null>(
    null
  );
  const [visitorName, setVisitorName] = useState(() => {
    try {
      return sessionStorage.getItem("fuinodev-visitor-name") || "";
    } catch {
      return "";
    }
  });
  const [nameIntent, setNameIntent] = useState<
    "chat" | "post" | "recommendation" | null
  >(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [recommendationOpen, setRecommendationOpen] = useState(false);
  function launch(intent: "chat" | "post" | "recommendation") {
    if (intent === "chat") setChatOpen(true);
    else if (intent === "post") open("post");
    else setRecommendationOpen(true);
  }
  function requestIdentity(intent: "chat" | "post" | "recommendation") {
    setMobileOpen(false);
    if (visitorName) launch(intent);
    else setNameIntent(intent);
  }
  const [article, setArticle] = useState<Post | null>(null);
  const [logo, setLogo] = useState("");
  const [notice, setNotice] = useState("");
  const [query, setQuery] = useState("");
  const [accent, setAccent] = useState(() => {
    try {
      return localStorage.getItem("fuinodev-accent") || "Notebook";
    } catch {
      return "Notebook";
    }
  });
  const { theme, setTheme } = useTheme();
  const [chartError, setChartError] = useState(false);
  const profile = data.profile;
  const published = data.posts.filter((p) => p.published);
  const go = (next: string, asAdmin = admin) => {
    navigate(
      `${asAdmin ? "/admin" : ""}${next === "overview" ? "/" : `/${next}`}`
    );
    setQuery("");
    setMobileOpen(false);
  };
  useEffect(() => {
    document.title = `FuinoDev — ${admin ? "Studio · " : ""}${
      page.charAt(0).toUpperCase() + page.slice(1)
    }`;
  }, [page, admin]);
  useEffect(() => {
    if (notice) {
      const t = setTimeout(() => setNotice(""), 5000);
      return () => clearTimeout(t);
    }
  }, [notice]);
  useEffect(() => {
    setChartError(false);
  }, [profile.github]);
  function save(next: Portfolio) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setData(next);
      setNotice("Saved. Your portfolio is up to date.");
      return true;
    } catch {
      setNotice(
        "Unable to save. Browser storage may be full or disabled. Try a smaller logo."
      );
      return false;
    }
  }
  function open(kind: typeof modal, item: typeof editing = null) {
    if (kind === "post" && !admin) return;
    setEditing(item);
    setLogo(item && "logo" in item ? item.logo : "");
    setModal(kind);
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!admin) return;
    const f = new FormData(event.currentTarget);
    const value = (key: string) => String(f.get(key) || "").trim();
    const id = editing?.id || crypto.randomUUID();
    if (modal === "project") {
      const item: Project = {
        id,
        name: value("name"),
        description: value("description"),
        logo,
        url: value("url"),
        category: value("category") || "PROJECT",
      };
      if (item.url && !safeUrl(item.url)) {
        setNotice("Use a complete http or https project URL.");
        return;
      }
      if (
        save({
          ...data,
          projects: editing
            ? data.projects.map((p) => (p.id === id ? item : p))
            : [...data.projects, item],
        })
      )
        setModal(null);
    }
    if (modal === "post") {
      if (!value("title") || !value("lesson") || (!admin && !visitorName)) {
        setNotice("Add a title and description before sharing.");
        return;
      }
      const item: Post = {
        id,
        title: value("title"),
        topic: "",
        lesson: value("lesson"),
        takeaway: "",
        author:
          editing && "author" in editing
            ? editing.author
            : admin
            ? profile.name
            : visitorName,
        date:
          editing && "date" in editing
            ? editing.date
            : new Date().toISOString(),
        published: admin && f.get("published") === "on",
      };
      if (
        save({
          ...data,
          posts: editing
            ? data.posts.map((p) => (p.id === id ? item : p))
            : [item, ...data.posts],
        })
      ) {
        setModal(null);
        setNotice(
          admin
            ? "Note saved."
            : "Your note is saved locally as a draft for review."
        );
      }
    }
    if (modal === "experience") {
      if (value("end") && value("end") < value("start")) {
        setNotice("End date must be after the start date.");
        return;
      }
      const item: Experience = {
        id,
        role: value("role"),
        organization: value("organization"),
        start: value("start"),
        end: value("end"),
        description: value("description"),
        kind: value("kind"),
      };
      if (
        save({
          ...data,
          experience: editing
            ? data.experience.map((p) => (p.id === id ? item : p))
            : [...data.experience, item],
        })
      )
        setModal(null);
    }
  }
  function remove(kind: "projects" | "posts" | "experience", id: string) {
    if (window.confirm("Delete this item? This cannot be undone."))
      save({ ...data, [kind]: data[kind].filter((p) => p.id !== id) });
  }
  async function upload(file?: File) {
    if (!file) return;
    if (
      !["image/png", "image/jpeg", "image/webp"].includes(file.type) ||
      file.size > 800000
    ) {
      setNotice("Choose a PNG, JPG, or WebP logo smaller than 800 KB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setLogo(String(reader.result));
    reader.onerror = () =>
      setNotice("Could not read this image. Please try again.");
    reader.readAsDataURL(file);
  }
  const val = (key: string) =>
    editing
      ? String((editing as unknown as Record<string, unknown>)[key] || "")
      : "";
  function exportData() {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "fuinodev-portfolio.json";
    a.click();
    URL.revokeObjectURL(url);
  }
  const navItem = (key: string, label: string, Icon: typeof FolderOpen) => (
    <button
      className={`nav-item ${page === key ? "active" : ""}`}
      onClick={() => go(key)}
      aria-current={page === key ? "page" : undefined}
    >
      <Icon size={17} />
      <span>{label}</span>
      {page === key && <span className="nav-dot" />}
    </button>
  );
  const sectionTitle = (n: string, title: string, subtitle?: string) => (
    <div className="section-heading">
      <div>
        {n && <span className="eyebrow">{n}</span>}
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </div>
  );
  const projectCard = (p: Project, i: number, preview = false) => (
    <article className={`project-card project-color-${i % 3}`} key={p.id}>
      <div className="project-top">
        <span className="micro">{p.category}</span>
        <ArrowUpRight size={17} />
      </div>
      <div className="project-logo">
        {p.logo ? (
          <img src={p.logo} alt={`${p.name} logo`} />
        ) : (
          <span>{preview ? ["↗", "m.", "⌘"][i % 3] : p.name.slice(0, 2)}</span>
        )}
      </div>
      <h3>{p.name}</h3>
      <p>{p.description}</p>
      <div className="project-bottom">
        {preview ? (
          <span>YOUR WORK GOES HERE</span>
        ) : p.url ? (
          <External href={p.url}>
            Explore project <ArrowUpRight size={13} />
          </External>
        ) : (
          <span>CRAFTED BY FUINODEV</span>
        )}
        {admin && !preview && (
          <div className="actions">
            <button
              aria-label={`Edit ${p.name}`}
              onClick={() => open("project", p)}
            >
              <Pencil size={15} />
            </button>
            <button
              aria-label={`Delete ${p.name}`}
              onClick={() => remove("projects", p.id)}
            >
              <Trash2 size={15} />
            </button>
          </div>
        )}
      </div>
    </article>
  );

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 801px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setMobileOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);
  const sidebar = (
    <aside className="portfolio-sidebar" aria-label="Portfolio navigation">
      <button className="wordmark" onClick={() => go("overview")}>
        FuinoDev
      </button>
      <div className="sidebar-main">
        <div className="nav-group">
          <div className="nav-label">PERSONAL SPACE</div>
          {navItem("wisdom", "Wisdom", BookOpen)}
        </div>
        <div className="nav-group">
          <div className="nav-label separated">WORKPLACE</div>
          {navItem("overview", "Overview", LayoutDashboard)}
          {navItem("talk", "Let’s talk", Mail)}
          {navItem("projects", "Projects", FolderOpen)}
          {navItem("stack", "Tech stack", Layers)}
          {navItem("certificates", "Certificates", Award)}
        </div>
        <div className="nav-group">
          <div className="nav-label separated">GUIDED</div>
          {navItem("resume", "Resume", FileText)}
          {navItem(
            "recommendations",
            admin ? "Recommendations" : "Leave a recommendation",
            MessageSquareQuote
          )}
        </div>

        {admin && (
          <div className="nav-group">
            <div className="nav-label separated">MANAGE</div>
            {navItem("settings", "Profile & settings", Settings2)}
          </div>
        )}
      </div>
      <div className="sidebar-bottom">
        <CommunityWidget
          name={visitorName}
          onOpen={() => requestIdentity("chat")}
        />
        <div className="theme-switch" aria-label="Color mode">
          {(
            [
              { value: "light", Icon: Sun },
              { value: "dark", Icon: Moon },
              { value: "system", Icon: Monitor },
            ] as const
          ).map(({ value, Icon }) => (
            <button
              key={value}
              aria-label={`${value} theme`}
              aria-pressed={theme === value}
              className={theme === value ? "selected" : ""}
              onClick={() => setTheme(value)}
            >
              <Icon size={15} />
            </button>
          ))}
        </div>
        <div className="sidebar-contact">
          <p>For work, collaborations &amp; everything else, reach me at</p>
          <a href={`mailto:${profile.email}`}>
            <Mail size={14} />
            <span>{profile.email}</span>
          </a>
        </div>
      </div>
    </aside>
  );
  return (
    <div
      className="portfolio-app"
      style={
        {
          "--portfolio-accent":
            palettes.find((p) => p.name === accent)?.color || "#62666c",
        } as React.CSSProperties
      }
    >
      {sidebar}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="left"
          className="portfolio-app mobile-navigation-panel"
          style={
            {
              "--portfolio-accent":
                palettes.find((p) => p.name === accent)?.color || "#62666c",
            } as React.CSSProperties
          }
        >
          <SheetTitle className="sr-only">Portfolio menu</SheetTitle>
          <SheetDescription className="sr-only">
            Navigate the portfolio and change your theme.
          </SheetDescription>
          {sidebar}
        </SheetContent>
      </Sheet>
      <div className="portfolio-shell">
        <header className="topbar">
          <div className="breadcrumb">
            <button
              className="mobile-menu-toggle"
              aria-label="Open navigation"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={20} />
            </button>
            <span>Workspace</span>
            <ChevronRight size={13} />
            <strong>
              {page === "stack"
                ? "Toolkit"
                : page === "settings"
                ? "Profile & settings"
                : page.charAt(0).toUpperCase() + page.slice(1)}
            </strong>
          </div>
          <div className="topbar-right">
            <span className="local-badge">
              {admin ? "LOCAL STUDIO" : "PORTFOLIO"}
            </span>
            <button
              className="view-switch"
              onClick={() =>
                go(page === "settings" ? "overview" : page, !admin)
              }
            >
              {admin ? <Eye size={16} /> : <Settings2 size={16} />}{" "}
              {admin ? "Visitor view" : "Admin view"}
            </button>
          </div>
        </header>
        <main className="portfolio-content" id="main-content">
          {admin && (
            <div className="admin-banner">
              <span>
                <strong>Your local studio.</strong> Changes are saved in this
                browser. Shared publishing and secure sign-in are not connected.
              </span>
              <button onClick={exportData} title="Download a backup">
                <Download size={18} />
                <span>Backup</span>
              </button>
            </div>
          )}
          {page === "overview" && (
            <>
              <section className="hero portrait-hero">
                <div className="hero-top">
                  <span className="eyebrow">
                    HELLO, I’M {profile.name.split(" ")[0].toUpperCase()}.
                  </span>
                  {profile.available && (
                    <span className="availability">
                      <i />
                      Open to opportunities
                    </span>
                  )}
                </div>
                <div className="hero-portrait">
                  <img
                    src="/images/joshua-halftone-v1.png"
                    alt={`Black-and-white portrait of ${profile.name}`}
                    width={1086}
                    height={1448}
                    fetchPriority="high"
                  />
                </div>
                <h1>{profile.name}</h1>
                <div className="hero-description">
                  <div>
                    <h2>{profile.role}</h2>
                    <p>{profile.bio}</p>
                  </div>
                </div>
                <div className="hero-footer">
                  <a
                    className="primary-button"
                    href={`mailto:${profile.email}`}
                  >
                    Let’s work together <ArrowUpRight size={17} />
                  </a>
                  <div className="social-links">
                    <External href={profile.github} aria-label="GitHub">
                      <Github size={21} />
                    </External>
                    <External href={profile.linkedin} aria-label="LinkedIn">
                      <Linkedin size={21} />
                    </External>
                    <External href={profile.instagram} aria-label="Instagram">
                      <Instagram size={21} />
                    </External>
                    <a href={`mailto:${profile.email}`} aria-label="Email">
                      <Mail size={21} />
                    </a>
                  </div>
                </div>
              </section>
              <section className="content-section">
                <div className="section-row">
                  {sectionTitle("", "Toolkit")}
                  <button className="text-button" onClick={() => go("stack")}>
                    Explore toolkit <ArrowUpRight size={16} />
                  </button>
                </div>
                <Toolkit
                  key="overview-toolkit"
                  stacks={profile.stacks}
                  overview
                />
              </section>
              <section className="content-section project-section">
                <div className="section-row">
                  {sectionTitle("", "Projects")}
                  <button
                    className="text-button"
                    onClick={() => go("projects")}
                  >
                    Explore all projects <ArrowUpRight size={16} />
                  </button>
                </div>
                <ProjectCarousel>
                  {(data.projects.length ? data.projects : sampleProjects).map(
                    (project, i) =>
                      projectCard(project, i, !data.projects.length)
                  )}
                </ProjectCarousel>
                {!data.projects.length && (
                  <p className="preview-caption">
                    Preview cards · add your own projects in the studio.
                  </p>
                )}
              </section>
              <section className="wisdom-preview">
                <div>
                  <span className="eyebrow">WISDOM</span>
                  <h2>{published[0]?.title || "Notes & ideas"}</h2>
                  <p>
                    {published[0]?.lesson.slice(0, 160) ||
                      "A place for things worth sharing."}
                  </p>
                </div>
                <button
                  className="circle-button"
                  aria-label="Read Wisdom"
                  onClick={() => go("wisdom")}
                >
                  <ArrowUpRight size={24} />
                </button>
              </section>
              <section className="content-section contributions">
                <div className="section-row">
                  {sectionTitle("", "GitHub contributions")}
                  <Github size={24} />
                </div>
                {profile.github &&
                safeUrl(profile.github) &&
                new URL(profile.github).hostname === "github.com" &&
                !chartError ? (
                  <>
                    <img
                      className="contribution-image"
                      src={`https://ghchart.rshah.org/${(
                        palettes.find((p) => p.name === accent)?.color ||
                        "#62666c"
                      ).slice(1)}/${encodeURIComponent(
                        new URL(profile.github).pathname
                          .split("/")
                          .filter(Boolean)[0] || ""
                      )}`}
                      alt="GitHub contribution activity over the past year"
                      onError={() => setChartError(true)}
                    />
                    <External href={profile.github} className="text-button">
                      View {new URL(profile.github).pathname.slice(1)} on GitHub{" "}
                      <ArrowUpRight size={16} />
                    </External>
                  </>
                ) : (
                  <div className="contribution-empty">
                    <Github size={26} />
                    <p>
                      {chartError
                        ? "The contribution chart is unavailable right now."
                        : "Connect your GitHub profile in settings."}
                    </p>
                    {profile.github && (
                      <External href={profile.github}>
                        Visit GitHub <ArrowUpRight size={16} />
                      </External>
                    )}
                  </div>
                )}
              </section>
            </>
          )}
          {page === "projects" && (
            <>
              <div className="page-heading simple-page-heading">
                <h1>Projects</h1>
              </div>
              <div className="list-toolbar">
                <input
                  aria-label="Search projects"
                  placeholder="Search projects…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                {admin && (
                  <button
                    className="primary-button"
                    onClick={() => open("project")}
                  >
                    <Plus size={17} />
                    Add project
                  </button>
                )}
              </div>
              {data.projects.length ? (
                <>
                  <p className="mobile-project-hint">
                    Swipe left or right to explore.
                  </p>
                  <div className="project-grid">
                    {data.projects
                      .filter((p) =>
                        `${p.name} ${p.description}`
                          .toLowerCase()
                          .includes(query.toLowerCase())
                      )
                      .map((project, i) => projectCard(project, i))}
                  </div>
                </>
              ) : (
                <div className="empty-state">
                  <FolderOpen size={30} />
                  <h3>Your projects belong here.</h3>
                  <p>Add a logo, a name, and a short description.</p>
                  {admin && (
                    <button
                      className="primary-button"
                      onClick={() => open("project")}
                    >
                      <Plus size={17} />
                      Add your first project
                    </button>
                  )}
                </div>
              )}
              {data.projects.length > 0 &&
                !data.projects.some((p) =>
                  `${p.name} ${p.description}`
                    .toLowerCase()
                    .includes(query.toLowerCase())
                ) && (
                  <div className="empty-state">
                    No projects match “{query}”.
                  </div>
                )}
            </>
          )}
          {page === "stack" && (
            <>
              <div className="page-heading simple-page-heading">
                <h1>Toolkit</h1>
              </div>
              <Toolkit key="full-toolkit" stacks={profile.stacks} />
              {admin && (
                <button
                  className="primary-button toolkit-edit"
                  onClick={() => go("settings")}
                >
                  <Pencil size={16} />
                  Edit toolkit
                </button>
              )}
            </>
          )}
          {page === "recommendations" && (
            <Recommendations
              items={data.recommendations}
              admin={admin}
              name={visitorName}
              composing={recommendationOpen}
              onCompose={() => requestIdentity("recommendation")}
              onClose={() => setRecommendationOpen(false)}
              onSave={(items) => save({ ...data, recommendations: items })}
            />
          )}
          {page === "certificates" && (
            <Certificates
              items={data.certificates}
              admin={admin}
              onSave={(items) => save({ ...data, certificates: items })}
            />
          )}
          {page === "talk" && <LetsTalk email={profile.email} />}
          {page === "wisdom" && (
            <Wisdom
              posts={data.posts}
              admin={admin}
              onRead={setArticle}
              onCreate={() => open("post")}
              onEdit={(post) => open("post", post)}
              onDelete={(id) => remove("posts", id)}
            />
          )}
          {page === "resume" && <ResumeTemplate />}
          {page === "settings" &&
            (admin ? (
              <>
                <div className="page-heading">
                  <span className="eyebrow">MAKE IT YOURS</span>
                  <h1>
                    The person behind the code<span>.</span>
                  </h1>
                  <p>
                    Your story, your links, your little corner of the internet.
                  </p>
                </div>
                <form
                  className="settings-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const f = new FormData(e.currentTarget);
                    const next = { ...profile };
                    for (const key of Object.keys(
                      profile
                    ) as (keyof typeof profile)[]) {
                      if (key !== "available")
                        next[key] = String(f.get(key) || "").trim();
                    }
                    next.available = f.get("available") === "on";
                    for (const key of [
                      "github",
                      "linkedin",
                      "instagram",
                    ] as const)
                      if (next[key] && !safeUrl(next[key])) {
                        setNotice(
                          `Enter a complete http or https URL for ${key}.`
                        );
                        return;
                      }
                    if (
                      next.github &&
                      (new URL(next.github).hostname !== "github.com" ||
                        !/^\/[a-zA-Z0-9-]+\/?$/.test(
                          new URL(next.github).pathname
                        ))
                    ) {
                      setNotice(
                        "Use a GitHub profile URL, such as https://github.com/your-username."
                      );
                      return;
                    }
                    save({ ...data, profile: next });
                  }}
                >
                  <div className="form-grid">
                    <Field label="Your name">
                      <input
                        name="name"
                        defaultValue={profile.name}
                        required
                        maxLength={80}
                      />
                    </Field>
                    <Field label="What do you do?">
                      <input
                        name="role"
                        defaultValue={profile.role}
                        required
                        maxLength={100}
                      />
                    </Field>
                    <Field label="Email">
                      <input
                        name="email"
                        type="email"
                        defaultValue={profile.email}
                        required
                      />
                    </Field>
                    <Field label="Location (optional)">
                      <input name="location" defaultValue={profile.location} />
                    </Field>
                  </div>
                  <Field label="A short introduction">
                    <textarea
                      name="bio"
                      defaultValue={profile.bio}
                      required
                      maxLength={600}
                    />
                  </Field>
                  <div className="form-grid">
                    {(["github", "linkedin", "instagram"] as const).map(
                      (key) => (
                        <Field
                          label={`${
                            key.charAt(0).toUpperCase() + key.slice(1)
                          } profile URL`}
                          key={key}
                        >
                          <input
                            name={key}
                            type="url"
                            defaultValue={profile[key]}
                            placeholder={`https://${key}.com/your-profile`}
                          />
                        </Field>
                      )
                    )}
                  </div>
                  <Field label="Your toolkit — one category per line, tools separated by commas">
                    <textarea
                      className="toolkit-input"
                      name="stacks"
                      defaultValue={profile.stacks}
                      placeholder="Frontend: React, TypeScript"
                    />
                  </Field>
                  <label className="checkbox-field">
                    <input
                      type="checkbox"
                      name="available"
                      defaultChecked={profile.available}
                    />
                    Open to opportunities
                  </label>
                  <button className="primary-button" type="submit">
                    <Check size={15} />
                    Save profile
                  </button>
                </form>
              </>
            ) : (
              <div className="empty-state">
                <h2>Profile settings live in the local studio.</h2>
                <button onClick={() => go("settings", true)}>
                  Open admin view
                </button>
              </div>
            ))}
          {page === "missing" && (
            <div className="empty-state">
              <h1>Page not found.</h1>
              <button className="primary-button" onClick={() => go("overview")}>
                Back to overview
              </button>
            </div>
          )}
          <footer className="portfolio-footer">
            <span>
              © {new Date().getFullYear()} FuinoDev{" "}
              <span className="footer-dot">·</span> Built with intention.
            </span>
            <div className="palette-picker">
              {palettes.map((p) => (
                <button
                  key={p.name}
                  title={p.name}
                  aria-label={`${p.name} accent`}
                  aria-pressed={accent === p.name}
                  className={accent === p.name ? "chosen" : ""}
                  style={{ background: p.color }}
                  onClick={() => {
                    setAccent(p.name);
                    try {
                      localStorage.setItem("fuinodev-accent", p.name);
                    } catch {
                      setNotice("Theme preference could not be saved.");
                    }
                  }}
                />
              ))}
              <span>{accent}</span>
            </div>
          </footer>
        </main>
      </div>
      {notice && (
        <div role="status" className="toast">
          {notice}
          <button
            aria-label="Dismiss notification"
            onClick={() => setNotice("")}
          >
            <X size={16} />
          </button>
        </div>
      )}
      <Dialog
        open={!!modal}
        onOpenChange={(v) => {
          if (!v) setModal(null);
        }}
      >
        <DialogContent
          className="portfolio-dialog glass-dialog"
          overlayClassName="glass-overlay"
        >
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit" : modal === "post" ? "Write" : "Create"}{" "}
              {modal === "project"
                ? "project"
                : modal === "post"
                ? "a Wisdom note"
                : "resume entry"}
            </DialogTitle>
            <DialogDescription>
              {modal === "project"
                ? "A logo, a name, and a simple description. That’s all you need."
                : modal === "post"
                ? "A title and a description. Make it yours."
                : "Follow the prompts to add a chapter to your chronological resume."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="editor-form">
            {modal === "project" && (
              <>
                <Field label="Project logo (optional, PNG/JPG/WebP, max 800 KB)">
                  <div className="upload-area">
                    {logo && <img src={logo} alt="Logo preview" />}
                    <input
                      aria-label="Upload project logo"
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={(e) => upload(e.target.files?.[0])}
                    />
                    {logo && (
                      <button type="button" onClick={() => setLogo("")}>
                        Remove logo
                      </button>
                    )}
                  </div>
                </Field>
                <Field label="What is the project called?">
                  <input
                    name="name"
                    defaultValue={val("name")}
                    required
                    maxLength={70}
                  />
                </Field>
                <Field label="What does it do?">
                  <textarea
                    name="description"
                    defaultValue={val("description")}
                    required
                    maxLength={300}
                  />
                </Field>
                <Field label="Category (optional)">
                  <input
                    name="category"
                    defaultValue={val("category")}
                    placeholder="Web application"
                    maxLength={35}
                  />
                </Field>
                <Field label="Project link (optional)">
                  <input
                    name="url"
                    type="url"
                    defaultValue={val("url")}
                    placeholder="https://"
                  />
                </Field>
              </>
            )}
            {modal === "post" && (
              <>
                <Field label="Title">
                  <input
                    name="title"
                    defaultValue={val("title")}
                    required
                    maxLength={120}
                    placeholder="Give your note a title"
                  />
                </Field>
                <Field label="Description">
                  <textarea
                    name="lesson"
                    className="long-input"
                    defaultValue={[val("lesson"), val("takeaway")]
                      .filter(Boolean)
                      .join("\n\n")}
                    required
                    maxLength={23000}
                    placeholder="Share your story, idea, or what you learned…"
                  />
                </Field>
                {admin ? (
                  <label className="checkbox-field">
                    <input
                      type="checkbox"
                      name="published"
                      defaultChecked={
                        !!(
                          editing &&
                          "published" in editing &&
                          editing.published
                        )
                      }
                    />
                    Publish in visitor view
                  </label>
                ) : (
                  <p className="form-caption">
                    Sharing as {visitorName}. Saved locally as a draft for
                    review.
                  </p>
                )}
              </>
            )}
            {modal === "experience" && (
              <>
                <Field label="What kind of chapter?">
                  <select
                    name="kind"
                    defaultValue={val("kind") || "Experience"}
                  >
                    <option>Experience</option>
                    <option>Education</option>
                  </select>
                </Field>
                <Field label="Role or qualification">
                  <input
                    name="role"
                    defaultValue={val("role")}
                    required
                    maxLength={120}
                  />
                </Field>
                <Field label="Company or school">
                  <input
                    name="organization"
                    defaultValue={val("organization")}
                    required
                    maxLength={120}
                  />
                </Field>
                <div className="form-grid">
                  <Field label="Start">
                    <input
                      type="month"
                      name="start"
                      defaultValue={val("start")}
                      required
                    />
                  </Field>
                  <Field label="End (leave blank if current)">
                    <input type="month" name="end" defaultValue={val("end")} />
                  </Field>
                </div>
                <Field label="What did you contribute or learn?">
                  <textarea
                    name="description"
                    defaultValue={val("description")}
                    required
                    maxLength={2000}
                  />
                </Field>
              </>
            )}
            <div className="form-buttons">
              <button
                type="button"
                className="secondary-button"
                onClick={() => setModal(null)}
              >
                Cancel
              </button>
              <button className="primary-button" type="submit">
                <Check size={15} />
                Save{" "}
                {modal === "post"
                  ? "note"
                  : modal === "project"
                  ? "project"
                  : "entry"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog
        open={!!article}
        onOpenChange={(v) => {
          if (!v) setArticle(null);
        }}
      >
        <DialogContent
          className="portfolio-dialog article-dialog glass-dialog"
          overlayClassName="glass-overlay"
        >
          <DialogHeader>
            <span className="eyebrow">{article?.author || profile.name}</span>
            <DialogTitle>{article?.title}</DialogTitle>
            <DialogDescription>
              {article && new Date(article.date).toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>
          <div className="article-body">{article?.lesson}</div>
          {article?.takeaway && (
            <div className="article-body">{article.takeaway}</div>
          )}
        </DialogContent>
      </Dialog>
      <NameGate
        open={!!nameIntent}
        onClose={() => setNameIntent(null)}
        onContinue={(name) => {
          setVisitorName(name);
          try {
            sessionStorage.setItem("fuinodev-visitor-name", name);
          } catch {
            /* Name remains available for this visit. */
          }
          const intent = nameIntent;
          setNameIntent(null);
          if (intent) launch(intent);
        }}
      />
      <CommunityChat
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        name={visitorName}
        onChangeName={() => {
          setChatOpen(false);
          setNameIntent("chat");
        }}
      />
    </div>
  );
}
