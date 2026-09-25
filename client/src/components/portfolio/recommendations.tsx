import { useState } from "react";
import { MessageSquareQuote, Plus, Check, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { Recommendation } from "@/lib/portfolio";
export function Recommendations({
  items,
  admin,
  name,
  composing,
  onCompose,
  onClose,
  onSave,
}: {
  items: Recommendation[];
  admin: boolean;
  name: string;
  composing: boolean;
  onCompose: () => void;
  onClose: () => void;
  onSave: (items: Recommendation[]) => boolean;
}) {
  const [feedback, setFeedback] = useState("");
  const visible = admin ? items : [];
  return (
    <>
      <div className="page-heading simple-page-heading">
        <h1>Recommendations</h1>
        <p>Words from people I’ve worked with.</p>
      </div>
      <div className="list-toolbar">
        <span className="local-content-note">
          {admin
            ? "Private letters · accept or reject each recommendation."
            : "Submissions in this preview are saved locally for review."}
        </span>
        <button
          className="primary-button"
          onClick={() => {
            setFeedback("");
            onCompose();
          }}
        >
          <Plus size={17} />
          Leave a recommendation
        </button>
      </div>
      {feedback && (
        <p role="status" className="inline-success">
          {feedback}
        </p>
      )}
      <div className="recommendation-grid">
        {visible.map((item) => (
          <article className="recommendation-card" key={item.id}>
            <MessageSquareQuote size={28} />
            <blockquote>{item.message}</blockquote>
            <div className="recommendation-author">
              <span className="recommendation-initials">
                {item.name
                  .split(/\s+/)
                  .map((part) => part[0])
                  .slice(0, 2)
                  .join("")}
              </span>
              <div>
                <strong>{item.name}</strong>
                {item.relationship && <p>{item.relationship}</p>}
              </div>
            </div>
            {admin && (
              <div className="recommendation-review">
                <span className="status-pill">
                  {item.status || (item.published ? "accepted" : "pending")}
                </span>
                <button
                  className="secondary-button"
                  onClick={() =>
                    onSave(
                      items.map((entry) =>
                        entry.id === item.id
                          ? { ...entry, published: false, status: "accepted" }
                          : entry
                      )
                    )
                  }
                >
                  <Check size={15} />
                  Accept
                </button>
                <button
                  className="secondary-button"
                  aria-label={`Reject recommendation from ${item.name}`}
                  onClick={() => {
                    onSave(
                      items.map((entry) =>
                        entry.id === item.id
                          ? { ...entry, published: false, status: "rejected" }
                          : entry
                      )
                    );
                  }}
                >
                  <X size={17} /> Reject
                </button>
              </div>
            )}
          </article>
        ))}
      </div>
      {admin && !visible.length && (
        <div className="empty-state">
          <MessageSquareQuote size={30} />
          <h3>A good collaboration leaves a story.</h3>
          <p>
            {admin && items.length
              ? "Submissions are waiting for review."
              : "No recommendation letters yet."}
          </p>
        </div>
      )}
      <Dialog
        open={composing}
        onOpenChange={(open) => {
          if (!open) onClose();
        }}
      >
        <DialogContent
          className="portfolio-dialog glass-dialog"
          overlayClassName="glass-overlay"
        >
          <DialogHeader>
            <DialogTitle>Leave a recommendation</DialogTitle>
            <DialogDescription>
              Sharing as {name}. Tell us about your experience working together.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              const f = new FormData(event.currentTarget);
              const message = String(f.get("message") || "").trim();
              if (!message || !name) return;
              if (
                onSave([
                  ...items,
                  {
                    id: crypto.randomUUID(),
                    name,
                    relationship: String(f.get("relationship") || "").trim(),
                    message,
                    date: new Date().toISOString(),
                    published: false,
                    status: "pending",
                  },
                ])
              ) {
                setFeedback(
                  "Thank you. Your recommendation is saved in this browser for review."
                );
                onClose();
              }
            }}
          >
            <label className="field">
              <span>How did we work together? (optional)</span>
              <input
                name="relationship"
                maxLength={100}
                placeholder="e.g. Project teammate"
              />
            </label>
            <label className="field">
              <span>Your recommendation</span>
              <textarea
                name="message"
                required
                maxLength={2000}
                placeholder="What was the experience like?"
              />
            </label>
            <button className="primary-button" type="submit">
              Submit for local review <Check size={16} />
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
