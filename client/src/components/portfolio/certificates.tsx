import { useState, type FormEvent } from "react";
import { Award, Plus, Pencil, Trash2, ArrowUpRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { safeUrl, type Certificate } from "@/lib/portfolio";

export function Certificates({
  items,
  admin,
  onSave,
}: {
  items: Certificate[];
  admin: boolean;
  onSave: (items: Certificate[]) => boolean;
}) {
  const [editing, setEditing] = useState<Certificate | null>(null);
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  function edit(item: Certificate | null) {
    setEditing(item);
    setImage(item?.image || "");
    setError("");
    setOpen(true);
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!admin || loading) return;
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "").trim();
    const issuer = String(form.get("issuer") || "").trim();
    const url = String(form.get("url") || "").trim();
    if (!name || !issuer) {
      setError("Enter the certificate name and issuer.");
      return;
    }
    if (url && !safeUrl(url)) {
      setError("Use a valid https:// or http:// credential link.");
      return;
    }
    const entry: Certificate = {
      id: editing?.id || crypto.randomUUID(),
      name,
      issuer,
      date: String(form.get("date") || ""),
      url,
      image,
    };
    if (
      onSave(
        editing
          ? items.map((item) => (item.id === editing.id ? entry : item))
          : [entry, ...items]
      )
    )
      setOpen(false);
    else
      setError("Could not save. Try a smaller image or check browser storage.");
  }
  return (
    <>
      <div className="page-heading simple-page-heading">
        <h1>Certificates</h1>
      </div>
      {admin && (
        <div className="list-toolbar">
          <span>Manage your credentials.</span>
          <button className="primary-button" onClick={() => edit(null)}>
            <Plus size={17} />
            Add certificate
          </button>
        </div>
      )}
      {items.length === 0 && (
        <div className="certificate-empty">
          <Award size={36} />
          <h2>
            {admin ? "Add your first certificate" : "Certificates coming soon"}
          </h2>
          <p>
            {admin
              ? "Upload a certificate image and add the details below."
              : "New credentials will appear here."}
          </p>
        </div>
      )}
      <div className="certificate-grid">
        {items.map((item) => (
          <article className="certificate-card" key={item.id}>
            <div className="certificate-art">
              {item.image ? (
                <img
                  src={item.image}
                  alt={`${item.name} certificate`}
                  loading="lazy"
                />
              ) : (
                <Award size={52} strokeWidth={1} />
              )}
            </div>
            <div className="certificate-details">
              <p className="certificate-issuer">{item.issuer}</p>
              <h2>{item.name}</h2>
              {item.date && (
                <time dateTime={item.date}>
                  {new Date(`${item.date}T00:00:00`).toLocaleDateString(
                    undefined,
                    { month: "long", year: "numeric" }
                  )}
                </time>
              )}
              {safeUrl(item.url) && (
                <a
                  className="certificate-link"
                  href={safeUrl(item.url)}
                  target="_blank"
                  rel="noreferrer"
                >
                  View credential <ArrowUpRight size={16} />
                </a>
              )}
              {admin && (
                <div className="certificate-actions">
                  <button
                    className="secondary-button"
                    onClick={() => edit(item)}
                  >
                    <Pencil size={15} />
                    Edit
                  </button>
                  <button
                    className="secondary-button"
                    aria-label={`Delete ${item.name}`}
                    onClick={() => {
                      if (window.confirm(`Delete “${item.name}”?`))
                        onSave(items.filter((entry) => entry.id !== item.id));
                    }}
                  >
                    <Trash2 size={15} />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
      <Dialog open={open && admin} onOpenChange={setOpen}>
        <DialogContent
          className="glass-dialog certificate-dialog"
          overlayClassName="glass-overlay"
        >
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit certificate" : "Add certificate"}
            </DialogTitle>
            <DialogDescription>
              Add a credential to your portfolio.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="certificate-form">
            <label className="field">
              <span>Certificate name *</span>
              <input
                name="name"
                required
                maxLength={160}
                defaultValue={editing?.name}
                placeholder="e.g. Full Stack Development"
              />
            </label>
            <label className="field">
              <span>Issuer *</span>
              <input
                name="issuer"
                required
                maxLength={120}
                defaultValue={editing?.issuer}
                placeholder="Organization or institution"
              />
            </label>
            <label className="field">
              <span>Date earned</span>
              <input name="date" type="date" defaultValue={editing?.date} />
            </label>
            <label className="field">
              <span>Credential link</span>
              <input
                name="url"
                type="url"
                defaultValue={editing?.url}
                placeholder="https://"
              />
            </label>
            <label className="field">
              <span>Certificate image (optional)</span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={async (event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  if (
                    !["image/png", "image/jpeg", "image/webp"].includes(
                      file.type
                    ) ||
                    file.size > 800000
                  ) {
                    setError("Choose a PNG, JPG, or WebP under 800 KB.");
                    event.target.value = "";
                    return;
                  }
                  setLoading(true);
                  setError("");
                  try {
                    const result = await new Promise<string>(
                      (resolve, reject) => {
                        const reader = new FileReader();
                        reader.onload = () => resolve(String(reader.result));
                        reader.onerror = reject;
                        reader.readAsDataURL(file);
                      }
                    );
                    setImage(result);
                  } catch {
                    setError("The image could not be read. Please try again.");
                  } finally {
                    setLoading(false);
                  }
                }}
              />
              <small>PNG, JPG, or WebP · up to 800 KB</small>
            </label>
            {image && (
              <div className="certificate-preview">
                <img src={image} alt="Certificate preview" />
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setImage("")}
                >
                  Remove image
                </button>
              </div>
            )}
            {error && <p role="alert">{error}</p>}
            <button className="primary-button" type="submit" disabled={loading}>
              {loading ? "Reading image…" : "Save certificate"}
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
