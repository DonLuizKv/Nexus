# Nexus — Design Context & Guidelines

Design guide for **Nexus**: a place to share, discover and install AI building blocks —
**prompts, skills, subagents, AI settings and context docs**. Dev/infra tooling (CI/CD,
Docker, pipelines) is out of scope and belongs to a separate site — not just text to
copy and paste.

> **The big idea — an almanac on a tiled sky.** Old-web ingredients (the tiled cloud wallpaper,
> hyperlink blue, the 1996 "core fonts for the web", webrings, guestbooks, hit counters) arranged
> with editorial restraint: paper background, generous spacing, one reading column, thin rules
> instead of boxes. It must feel crafted and nostalgic **for the reader**, never like an OS or a
> desktop. Usability first: legible contrast, keyboard paths, labeled controls, responsive.

Everything visual lives in `src/routes/layout.css` (`@theme` tokens + a few `@utility` classes).
Do not hardcode colors or fonts in markup; use the utilities the tokens generate.

---

## 1. Stack

- **SvelteKit 3** + **Svelte 5 runes** (forced for the whole project in `vite.config.ts`).
- **Tailwind CSS v4**, CSS-first config. No `tailwind.config.js`.
- **TypeScript** strict.
- **Icons:** `@tabler/icons-svelte-runes`, imported **per icon** for fast dev builds:
  `import IconCopy from '@tabler/icons-svelte-runes/icons/copy';`
- Import alias `#lib/*` → `src/lib/*`. `$lib` is not used.
- **No web fonts.** System "core fonts" only (Georgia, Verdana, Courier New).
- Adapter: Vercel. Static files are referenced with `asset('images/…')` from `$app/paths`
  (never `import x from '/images/…'`: that breaks hydration in dev).

| Action     | Command       |
| ---------- | ------------- |
| Dev        | `pnpm dev`    |
| Build      | `pnpm build`  |
| Type-check | `pnpm check`  |
| Lint       | `pnpm lint`   |
| Format     | `pnpm format` |

Finish every change with `pnpm format`, `pnpm lint` and `pnpm check` green.

---

## 2. Color — every color means something

| Role              | Tokens                                                  | Use                                                    |
| ----------------- | ------------------------------------------------------- | ------------------------------------------------------ |
| Surfaces          | `paper` `paper-deep` `sheet`                            | Page, alternating bands, cards/inputs                  |
| Ink               | `ink` `ink-soft` `ink-faint` `rule`                     | Text hierarchy and hairline rules                      |
| **Action**        | `link` `link-deep` `link-visited` `link-active`         | Links and the primary button. Nothing decorative.      |
| **Data**          | `marker` (#fff27a)                                      | `{{variables}}`, search hits, selected file, selection |
| **Artifact kind** | `k-prompt` `k-skill` `k-agent` `k-settings` `k-context` | The type of an entry, and only that                    |
| Danger            | `danger` `danger-soft` `danger-ink`                     | Delete, burn-after-reading                             |
| Brand             | `sky` `sky-deep` + `.sky` utility (tiled clouds)        | Masthead, avatars, auth postcard, footer strip         |
| Status            | `ok`                                                    | "● Ahora", "escribiendo…", passed checks               |

Kind colors (all ≥4.5:1 with white text):

| Kind       | Label     | Color     | Icon (tabler) |
| ---------- | --------- | --------- | ------------- |
| `prompt`   | Prompt    | `#2f6fc2` | `prompt`      |
| `skill`    | Skill     | `#1d7a46` | `tool`        |
| `agent`    | Subagente | `#c2410c` | `robot`       |
| `settings` | Ajustes   | `#0f766e` | `settings-2`  |
| `context`  | Contexto  | `#a15c07` | `books`       |

The single source for kind label, hint, icon, classes and starter file is `KINDS` in
`src/lib/entries/catalog.ts`. Class strings there are literal so Tailwind sees them; reuse
`info.bg`, `info.text`, `info.soft`, `info.border` instead of composing class names.
Soft tints use opacity modifiers (`bg-k-skill/10`).

**Rules:** don't use a kind color for anything except its kind; don't introduce new accents for
decoration; yellow is never a button.

---

## 3. Typography

| Token        | Stack                               | Role                                 |
| ------------ | ----------------------------------- | ------------------------------------ |
| `font-serif` | Georgia, 'Times New Roman', serif   | Default body, headings, the wordmark |
| `font-sans`  | Verdana, Tahoma, Geneva, sans-serif | UI: buttons, labels, meta, tabs      |
| `font-mono`  | 'Courier New', Courier, monospace   | File contents, paths, counters       |

Body is 17px / 1.6. Headings: `text-[32px]` sections, `clamp(2.2rem,5vw,3.6rem)` page titles,
`text-[20px]` card titles. The `.eyebrow` utility (11px, bold, tracked, uppercase sans) labels
every field and small section.

---

## 4. Utilities (`layout.css`)

| Utility        | What it is                                                             |
| -------------- | ---------------------------------------------------------------------- |
| `.sky`         | Tiled cloud wallpaper. Always pair with a navy wash for text contrast. |
| `.ruled`       | Ruled manuscript sheet (1.75em rules + red margin). Prose files.       |
| `.btn`         | Square, 1px ink border, inset bottom shadow, presses down 1px.         |
| `.btn-primary` | Hyperlink-blue fill. One per area.                                     |
| `.btn-danger`  | Red fill. Destructive/irreversible only.                               |
| `.field`       | Text input / select / textarea. Blue outline on focus.                 |
| `.eyebrow`     | Small label style.                                                     |

No rounded corners anywhere. Shadows are hard offsets (`shadow-[6px_6px_0_…]`), never blurs.
Focus is a 2px dotted outline (global `:focus-visible`).

---

## 5. Components (`src/lib/components`)

| Component      | Purpose                                                                                                                                                                            |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Masthead`     | Sky header. Hero variant on `/` (wordmark, search, kind chips); compact elsewhere. `/` focuses search.                                                                             |
| `SiteFooter`   | Webring blurb, odometer counter, site map.                                                                                                                                         |
| `Wordmark`     | "Nexus ✦" in Georgia italic with a hard navy shadow.                                                                                                                               |
| `EntryCard`    | **The grid unit.** A folder: colored kind tab on top, title, 3-line summary, main file path (+N), author and stats. Whole card is one link (stretched `::after`). Optional `rank`. |
| `KindBadge`    | Kind label + icon, `solid` (tab) or `soft` (inline).                                                                                                                               |
| `Avatar`       | Square cut from the sky wallpaper with the initial. `sm` / `md` / `lg`.                                                                                                            |
| `PromptText`   | File content: `sheet` (ruled, highlights `{{vars}}`) or `code` (numbered listing).                                                                                                 |
| `FileBrowser`  | Tree-ish file list (grouped by folder, arrow keys) + viewer with copy/download.                                                                                                    |
| `InstallPanel` | Tabs: bash script, PowerShell script, "paste into your agent" Markdown; plus .zip.                                                                                                 |
| `TestBench`    | Fill variables, pick a model, stream a (simulated) answer. Prompts only.                                                                                                           |
| `EntryEditor`  | Create/edit: kind picker, metadata, multi-file editor with upload/drag-drop, live preview.                                                                                         |
| `ShareDialog`  | Native `<dialog>`: link, visibility note, Markdown bundle, README badge.                                                                                                           |
| `AuthShell`    | Two-column auth layout (sky postcard + form).                                                                                                                                      |
| `AuthGate`     | "Sign in to continue" block for protected pages.                                                                                                                                   |

### Layout rules

- Page container: `mx-auto max-w-[1180px] px-5 sm:px-8`.
- **Any list with more than 2 entries is a grid of `EntryCard`s**:
  `grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3` (4 columns for compact rankings,
  `xl:grid-cols-3` next to a sidebar).
- Sections open with a serif heading over a 2px ink rule (`border-b-2 border-ink pb-3`).
- Alternate heavy sections with a `bg-paper-deep` band bordered by `border-rule`.
- Detail pages start with a 6px bar in the kind color under the masthead.

### Old-web relics (each one does a job)

- **Voy a tener suerte** → random entry. **Webring** → previous/next public entry.
- **Libro de visitas** → comments. **Odometer** → total copies + downloads.
- **Marquee** of recent activity → pausable button, pauses on hover/focus, static under
  `prefers-reduced-motion`.
- Dotted focus rings, blue underlined links, `kbd` hints.

### Motion

`animate-rise` (staggered by `animation-delay`) for hero and cards, `animate-drift` on the hero
sky, `animate-marquee`, `animate-caret` while streaming. All disabled by reduced motion.

---

## 6. Data model (front end)

`src/lib/entries/types.ts`:

```ts
Entry { slug, kind, title, summary, category, tags[], targets[], author, visibility,
        files: { path, content }[], stars, uses, comments[], createdAt, updatedAt }
```

- `files[0]` is the main file: what "Copiar" copies and what the test bench runs.
- `path` is relative to the project root where it gets installed. Validated by `pathError()`
  (`[\w.-]` segments, no `..`, no absolute paths) so generated install scripts are safe.
- `visibility`: `public` (listed), `unlisted` (link only, `noindex`), `burn` (interstitial, deleted
  on open).
- Real `.env` files and credential-shaped content are rejected by the editor (`pathError`,
  `looksLikeSecret` in `bundle.ts`); publish `.env.example` instead.
- Only the author can edit or delete. Stars and comments require a session.

State lives in two runes-based singletons, the only things pages talk to:

- `library` (`src/lib/entries/library.svelte.ts`): search, CRUD, stars, uses, comments.
- `auth` (`src/lib/auth.svelte.ts`): `user`, `register`, `login`, `guest`, `logout`, `profile`.

Both persist to `localStorage` for now and call `load()` once from the root layout after
hydration. Swapping them for the real API must not change their public surface.

---

## 7. Code conventions

- Runes only (`$state`, `$derived`, `$props`, `$effect`); `onclick={…}` attributes; no stores.
- Never `structuredClone` a `$state` proxy — use `$state.snapshot`.
- Don't set state inside `$effect` to "reset" UI; scope it (see `/u/[handle]`) or use `{#key}`.
- Internal links and `goto` always go through `resolve()` from `$app/paths`.
- Conditional classes with arrays: `class={['base', cond && 'x', info.bg]}`.
- Format: tabs, single quotes, `printWidth: 100`, Tailwind classes sorted by Prettier.
- Run `npx @sveltejs/mcp svelte-autofixer <file>` on new components.

## 8. Checklist for new pages

1. Reuses `Masthead`/`SiteFooter` (via layout), `EntryCard`, tokens and utilities?
2. Lists of 3+ entries rendered as a card grid?
3. Color used only for action, data, kind or danger?
4. Every control labeled; tab order sensible; focus visible; works at 360px wide?
5. `<title>` set; private or personal pages carry `noindex`?
6. `pnpm format`, `pnpm lint`, `pnpm check` green.
