import { useState } from "react";
import { List, LayoutGrid, Plus, Pencil, Trash2, BookOpen } from "lucide-react";
import type { Post } from "@/lib/portfolio";
export function Wisdom({
  posts,
  admin,
  onRead,
  onEdit,
  onDelete,
  onCreate,
}: {
  posts: Post[];
  admin: boolean;
  onRead: (post: Post) => void;
  onEdit: (post: Post) => void;
  onDelete: (id: string) => void;
  onCreate: () => void;
}) {
  const [grid, setGrid] = useState(false);
  const [query, setQuery] = useState("");
  const visible = posts.filter(
    (post) =>
      (admin || post.published) &&
      `${post.title} ${post.lesson}`.toLowerCase().includes(query.toLowerCase())
  );
  return (
    <>
      <div className="wisdom-heading">
        <div>
          <h1>Wisdom</h1>
          <p>
            Thoughts, tutorials, and notes on engineering and building things.
          </p>
        </div>
        <div className="wisdom-layout" aria-label="Article layout">
          <button
            aria-label="List view"
            aria-pressed={!grid}
            onClick={() => setGrid(false)}
          >
            <List size={18} />
          </button>
          <button
            aria-label="Grid view"
            aria-pressed={grid}
            onClick={() => setGrid(true)}
          >
            <LayoutGrid size={18} />
          </button>
        </div>
      </div>
      <div className="list-toolbar">
        <input
          aria-label="Search Wisdom"
          placeholder="Search notes…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        {admin && (
          <button className="primary-button" onClick={onCreate}>
            <Plus size={16} />
            Write a note
          </button>
        )}
      </div>
      <div className={`wisdom-articles ${grid ? "grid" : "list"}`}>
        {visible.map((post, index) => (
          <article key={post.id} className="wisdom-item">
            <button className="wisdom-read" onClick={() => onRead(post)}>
              <span
                className={`wisdom-thumbnail pattern-${index % 3}`}
                aria-hidden="true"
              >
                <BookOpen size={34} strokeWidth={1} />
              </span>
              <span className="wisdom-copy">
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString(undefined, {
                    month: "short",
                    year: "numeric",
                  })}
                  {!post.published && " · Draft"}
                </time>
                <h2>{post.title}</h2>
                <p>{post.lesson}</p>
                <span className="wisdom-read-time">
                  Read ·{" "}
                  {Math.max(
                    1,
                    Math.ceil(post.lesson.trim().split(/\s+/).length / 200)
                  )}{" "}
                  min
                </span>
              </span>
            </button>
            {admin && (
              <div className="wisdom-actions">
                <button
                  aria-label={`Edit ${post.title}`}
                  onClick={() => onEdit(post)}
                >
                  <Pencil size={16} />
                </button>
                <button
                  aria-label={`Delete ${post.title}`}
                  onClick={() => onDelete(post.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
          </article>
        ))}
      </div>
      {!visible.length && (
        <div className="empty-state">
          <BookOpen />
          <h3>{query ? "No matching notes" : "No notes yet"}</h3>
          <p>
            {admin
              ? "Create a note with a title and description."
              : "New writing will appear here."}
          </p>
        </div>
      )}
    </>
  );
}
