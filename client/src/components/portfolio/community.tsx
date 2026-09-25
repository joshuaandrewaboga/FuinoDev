import { useEffect, useRef, useState, type FormEvent } from "react";
import { ImagePlus, Send, X, MessageCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
export function StickerAvatar({
  name = "You",
  size = 36,
}: {
  name?: string;
  size?: number;
}) {
  const variant =
    [...name].reduce((sum, char) => sum + char.charCodeAt(0), 0) % 3;
  return (
    <span
      className={`sticker-avatar sticker-${variant}`}
      style={{ width: size, height: size }}
      title={name}
    >
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path
          d="M9 22C7 7 17 3 26 5s17 10 13 24l-3 12H12z"
          fill="currentColor"
        />
        <ellipse
          cx="24"
          cy="26"
          rx="13"
          ry="15"
          fill="var(--sticker-face, white)"
        />
        <path
          d={
            variant === 1
              ? "M11 22 17 9 37 15 35 24 25 15Z"
              : "M10 23 13 10 35 10 39 23 29 15 23 21 19 15Z"
          }
          fill="currentColor"
        />
        <circle cx="19" cy="26" r="1.5" />
        <circle cx="29" cy="26" r="1.5" />
        <path
          d="M20 33q4 4 8 0"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}
export function CommunityWidget({
  name,
  onOpen,
}: {
  name: string;
  onOpen: () => void;
}) {
  return (
    <div className="community-widget">
      <div className="viewing-status">
        <StickerAvatar name={name || "You"} />
        <span>
          <strong>You’re viewing now</strong>
          <small>This browser · local preview</small>
        </span>
        <span className="online-dot" />
      </div>
      <button className="nav-item" onClick={onOpen}>
        <MessageCircle size={18} />
        <span>Community chat</span>
      </button>
    </div>
  );
}
export function NameGate({
  open,
  onClose,
  onContinue,
}: {
  open: boolean;
  onClose: () => void;
  onContinue: (name: string) => void;
}) {
  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) onClose();
      }}
    >
      <DialogContent
        className="portfolio-dialog glass-dialog identity-dialog"
        overlayClassName="glass-overlay"
      >
        <DialogHeader>
          <div className="welcome-sticker">
            <StickerAvatar name="Hello" size={64} />
          </div>
          <DialogTitle>First, what should we call you?</DialogTitle>
          <DialogDescription>
            Your name will appear beside what you share.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const name = String(
              new FormData(event.currentTarget).get("name") || ""
            ).trim();
            if (name) onContinue(name);
          }}
        >
          <label className="field">
            <span>Your name</span>
            <input
              name="name"
              placeholder="e.g. Alex"
              autoComplete="given-name"
              required
              maxLength={60}
              autoFocus
            />
          </label>
          <button className="primary-button full-button" type="submit">
            Continue <Send size={16} />
          </button>
          <p className="form-caption">
            No account needed. This preview saves your name for this tab.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
type Message = {
  id: string;
  name: string;
  body: string;
  image?: string;
  date: string;
};
const KEY = "fuinodev-community-v1";
function readMessages(): Message[] {
  try {
    const items = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(items)
      ? items
          .filter(
            (m) =>
              typeof m.id === "string" &&
              typeof m.name === "string" &&
              typeof m.body === "string" &&
              typeof m.date === "string"
          )
          .map((m) => ({
            ...m,
            image:
              typeof m.image === "string" &&
              /^data:image\/(png|jpeg|webp);base64,/.test(m.image)
                ? m.image
                : undefined,
          }))
      : [];
  } catch {
    return [];
  }
}
export function CommunityChat({
  open,
  onClose,
  name,
  onChangeName,
}: {
  open: boolean;
  onClose: () => void;
  name: string;
  onChangeName: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>(readMessages);
  const [body, setBody] = useState("");
  const [attachment, setAttachment] = useState("");
  const [error, setError] = useState("");
  const [reading, setReading] = useState(false);
  const feed = useRef<HTMLDivElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key === KEY) setMessages(readMessages());
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  useEffect(() => {
    if (feed.current) feed.current.scrollTop = feed.current.scrollHeight;
  }, [messages, open]);
  function send(event: FormEvent) {
    event.preventDefault();
    if (!name || (!body.trim() && !attachment) || reading) return;
    const next = [
      ...readMessages(),
      {
        id: crypto.randomUUID(),
        name,
        body: body.trim(),
        image: attachment || undefined,
        date: new Date().toISOString(),
      },
    ];
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
      setMessages(next);
      setBody("");
      setAttachment("");
      setError("");
      if (fileInput.current) fileInput.current.value = "";
    } catch {
      setError(
        "This browser is out of storage. Remove the image or send a shorter message."
      );
    }
  }
  function attach(file?: File) {
    if (!file) return;
    if (
      !["image/png", "image/jpeg", "image/webp"].includes(file.type) ||
      file.size > 600000
    ) {
      setError("Choose a PNG, JPG, or WebP image under 600 KB.");
      return;
    }
    setReading(true);
    const reader = new FileReader();
    reader.onload = () => {
      setAttachment(String(reader.result));
      setReading(false);
      setError("");
    };
    reader.onerror = () => {
      setError("This image could not be read.");
      setReading(false);
    };
    reader.readAsDataURL(file);
  }
  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) onClose();
      }}
    >
      <DialogContent
        className="portfolio-dialog glass-dialog community-dialog"
        overlayClassName="glass-overlay"
      >
        <DialogHeader>
          <DialogTitle>Community chat</DialogTitle>
          <DialogDescription>
            A space to say hello, share an idea, or leave a note.
          </DialogDescription>
        </DialogHeader>
        <div className="local-chat-notice">
          Local preview · messages are saved in this browser, not sent to other
          visitors.
        </div>
        <div
          className="chat-feed"
          ref={feed}
          role="log"
          aria-live="polite"
          aria-label="Community messages"
        >
          {messages.length ? (
            messages.map((message) => (
              <article className="chat-message" key={message.id}>
                <StickerAvatar name={message.name} />
                <div>
                  <div className="chat-message-heading">
                    <strong>{message.name}</strong>
                    <time dateTime={message.date}>
                      {new Date(message.date).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </time>
                  </div>
                  {message.body && <p>{message.body}</p>}
                  {message.image && (
                    <a href={message.image} target="_blank" rel="noreferrer">
                      <img
                        src={message.image}
                        alt={`Image shared by ${message.name}`}
                      />
                    </a>
                  )}
                </div>
              </article>
            ))
          ) : (
            <div className="chat-empty">
              <MessageCircle size={32} />
              <h3>Make the first connection.</h3>
              <p>Your next conversation starts with a hello.</p>
            </div>
          )}
        </div>
        <form onSubmit={send} className="chat-compose">
          <div className="composer-identity">
            <StickerAvatar name={name} size={28} />
            <span>
              Sharing as <strong>{name}</strong>
            </span>
            <button
              type="button"
              className="text-button"
              onClick={onChangeName}
            >
              Change
            </button>
          </div>
          <label className="field">
            <span>What would you like to share?</span>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              maxLength={3000}
              placeholder="Say hello or share an idea…"
              aria-label="Your message"
            />
          </label>
          {attachment && (
            <div className="attachment-preview">
              <img src={attachment} alt="Image ready to share" />
              <button
                type="button"
                aria-label="Remove attached image"
                onClick={() => {
                  setAttachment("");
                  if (fileInput.current) fileInput.current.value = "";
                }}
              >
                <X size={16} />
              </button>
            </div>
          )}
          {error && (
            <p role="alert" className="form-error">
              {error}
            </p>
          )}
          <div className="composer-actions">
            <label className="secondary-button upload-button">
              <ImagePlus size={18} />
              Add image
              <input
                ref={fileInput}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(e) => attach(e.target.files?.[0])}
              />
            </label>
            <button
              type="submit"
              className="primary-button"
              disabled={reading || (!body.trim() && !attachment)}
            >
              <Send size={16} />
              {reading ? "Reading image…" : "Send locally"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
