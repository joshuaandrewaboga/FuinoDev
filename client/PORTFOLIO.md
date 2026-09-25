# FuinoDev portfolio

A Refine + React portfolio with a visitor experience and local admin studio.

## Run

- `npm install`
- `npm run dev`
- `npm run build` checks TypeScript and generates `dist`.

## Experience

- The desktop sidebar keeps its layout. At 800px and below, a compact header opens an accessible modal drawer. Escape, outside click, and navigation close the drawer; switching to desktop also dismisses it.
- Wisdom and Recommendations appear before Workspace.
- The overview uses the owner name and role. The Toolkit and Projects pages have simple headings and readable type.
- The toolkit moves automatically on the overview. The full Toolkit page has a persistent animation switch, alternating infinite rows, and edge fades. Hover pauses a row. System reduced-motion preferences disable autoplay.
- Overview projects use previous/next controls and automatic advancement, paused by hover/focus or manual navigation. The full Projects page keeps a desktop grid and horizontally scrollable mobile cards.
- Branded tool icons are local assets; protocols and concepts use descriptive symbols. Sources: `public/tool-icons/SOURCES.md`.
- The GitHub identity defaults to `https://github.com/joshuaandrewaboga`. Old browser data receives a one-time owner identity correction. Later profile edits are preserved.

## Content

- **Profile & settings:** introduction, email, social URLs, availability, and toolkit. Format: `Frontend: React, TypeScript` with one category per line.
- **Projects:** name and description are required. PNG/JPG/WebP logos up to 800 KB, category, and URL are optional.
- **Wisdom:** only title and description. Visitor submissions ask for a name and become drafts; admin can edit and publish them. Older notes retain their previous text. Reading view uses a large bold title.
- **Recommendations:** visitors leave testimonials under their chosen name. Admin approves or unpublishes them; visitor view shows approved entries only.
- **Community:** glass-style name prompt and chat composer, with optional PNG/JPG/WebP attachments under 600 KB. Messages persist locally and sync across tabs on the same origin. There are no simulated people or invented online counts: the widget says the current visitor is viewing this local preview.
- **Resume:** chronological experience and education with a print / Save PDF action.
- **Appearance:** persistent light/dark/system mode and accent colors.
- **Backup:** downloads portfolio content as JSON. Community messages use separate browser storage and are not included in this backup.

## Storage and production boundaries

Portfolio data: `fuinodev-portfolio-v1` in localStorage. Community messages: `fuinodev-community-v1` in localStorage. Visitor name: `fuinodev-visitor-name` in sessionStorage. Storage is scoped to the browser and origin.

This is a local editor and visitor preview. No authentication backend, shared public publishing, remote chat, or global presence service is configured. Admin routes are not protected; draft visibility and testimonial review are UI features rather than security boundaries. Names are display names, not verified identities. The UI states these limitations.

Before public deployment, use authenticated server-side CRUD/storage through a Refine data provider, enforce owner permissions, serve only approved public content, and connect shared messages and presence. Deploying `dist` alone does not publish local edits to other users. Configure the host to route app URLs to `index.html`.

The GitHub contribution image uses `ghchart.rshah.org`; its fallback links to the correct GitHub profile if the chart is unavailable.

## Verification

TypeScript, targeted lint, and production build checks. Browser verification covers compact mobile navigation, name-first chat, local saving, two-field Wisdom drafts and publishing, testimonial moderation, animation toggles, overflow, and carousel controls. Interaction test content uses `localhost:5173`, separate from the main preview at `127.0.0.1:5173`.

The pre-existing corrupt Git index was not modified.

Certificates: open /admin/certificates to add, edit, or delete credentials. Name and issuer are required; date, verification link, and PNG/JPG/WebP image (up to 800 KB) are optional. Visitor gallery: /certificates. Records use the existing local browser portfolio storage; this is not authenticated server administration.


Updated navigation: Wisdom first; Overview, Let's talk, Projects, Tech stack in Workspace. Compact sidebar footer. Toolkit restores all 34 learned categories once and preserves future edits. Guided Resume is a labeled fictional John Dela Cruz / UP Diliman sample. Wisdom has list/grid presentation and admin-view authoring. Recommendation letters are hidden in visitor view, with accepted/rejected states in local admin. Let's talk offers PHP 5,000/hour services and a questionnaire that opens a reviewable email draft; it does not send automatically. Admin visibility is not secure authentication and browser storage is not a shared backend.

