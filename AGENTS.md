# AGENTS.md

Context for AI coding agents (and humans) working on this repo.

## How to work on this repo

- The owner is building this project **to learn**. By default, explain what to change and why, and let him write the code. Only edit files directly when explicitly asked.
- Keep third-party dependencies to a minimum: no headless CMS, no auth library. Exceptions so far: Drizzle ORM, better-sqlite3, sharp (planned), ffmpeg (planned).
- This is **SvelteKit 3**. Many docs, tutorials and AI snippets still show v2 APIs: check `node_modules/@sveltejs/kit/types/index.d.ts` before suggesting an import (see "SvelteKit 3 gotchas" below).
- Branches: one branch per feature/fix (`feature/...`, `fix/...`, `docs/...`), cut from `develop` and merged back into `develop` via PR. `develop` is then merged into `main`. Never commit straight to `main`.
- Useful commands: `npm run dev`, `npm run check`, `npm run test:unit`, `npm run db:generate`, `npm run db:migrate`, `npm run db:studio`.

Last updated: 2026-11-14. Repo: `alessiogs/music-portfolio` (public), work happens on `develop`, feature branches merged via PR.

## What it is

A self-hosted, open-source music portfolio + streaming site. One install = one artist (WordPress-style). The artist uploads music from all their projects (bands, solo work) through a hand-built CMS. A multi-user/multi-artist platform is a separate future project, explicitly out of scope.

The owner (Alessio) is a developer building this **to learn**: he writes the code himself, Claude explains and reviews. Prefer giving step-by-step instructions + reasoning over writing code into the repo. Avoid third-party packages where reasonable (no headless CMS, no auth library).

Name: not decided yet.

## Stack

- **SvelteKit 3** (3.1.1), Svelte 5 (runes), TypeScript, Vite 8, Tailwind 4, `@sveltejs/adapter-node`
- **SQLite** via **better-sqlite3** + **Drizzle ORM** (`casing: 'snake_case'`). Queries are synchronous (`.get()`, `.all()`, `.run()`).
- Pragmas on connect: `journal_mode = WAL`, `foreign_keys = ON`, `busy_timeout = 5000`
- Migrations: `db:generate` + `db:migrate`, the `drizzle/` folder is committed. Avoid `db:push`.
- Planned: local file storage behind a storage interface (S3 later), ffmpeg for audio transcoding, sharp for image resizing (accepted dependency), single Docker image with a volume for DB + media.
- Considered and rejected: Next.js, TanStack Start (briefly reconsidered on 2026-11-09, decided to stay with SvelteKit), Postgres, headless CMS (Payload/Strapi/Directus), Turso/libsql.

### SvelteKit 3 gotchas (verified against the installed package)

- `$lib` is removed. Use the Node subpath import `#lib`, declared in `package.json` `imports`. **Always include the file extension**: `#lib/server/db/index.ts` (TypeScript fails without it; Vite is lenient).
- Hook types (`Handle`, `ServerInit`, `HandleFetch`...) and `sequence` come from `@sveltejs/kit/hooks`, not `@sveltejs/kit`. `redirect`, `fail`, `Cookies` are still in `@sveltejs/kit`.
- Route types (`PageServerLoad`, `Actions`, `LayoutServerLoad`) come from the generated `./$types`.
- `$service-worker` is removed: use `immutable`, `assets`, `prerendered` from `$app/manifest`, `version` from `$app/env`, `resolve()` from `$app/paths`.
- `$app/forms` (`enhance`) and `$app/env/private` still exist.
- A `+page.server.ts` whose `load` only calls `redirect()` makes that page's `data` type `never`.
- Docs, tutorials and AI snippets often lag behind v3: check the package's `types/index.d.ts` when in doubt.

## Content model (implemented)

All in `src/lib/server/db/schemas/`, one file per entity; helpers in `db/utils/` (`id`, `status`, `position`, `dates`).

- **asset**: every uploaded file (image/audio): `storageKey`, original name, mime, size, sha256, width/height, durationMs. Resized/transcoded variants are derived from `storageKey` by convention, no extra rows.
- **site**: singleton row (`CHECK id = 1`): `artistPersonId` (required, the person who is the Artist; deleting that person is `restrict`), tagline, avatar, `links` JSON. The artist's name and bio are read from the person, not stored on the site.
- **person**: anyone credited (members, writers, producers, photographers), and the Artist: name, bio, url. No slug: persons have no page of their own.
- **project**: band or solo: slug, name, kind, bio, activeFrom/To, cover, position, status.
- **project_member**: project ↔ person with role and active dates.
- **release**: album/ep/single/live/compilation, per project, releasedOn, artwork.
- **release_track**: release ↔ song, disc + position. A song can appear on several releases; songs with no track = unreleased demos.
- **song**: belongs to a project: title, audio asset, writtenOn, producedOn, lyrics, notes, `downloadable` flag, status.
- **song_credit**: song ↔ person ↔ role (writer, lyricist, composer, producer, mixing, mastering). PK (song, person, role).
- **photo**: asset + optional description, takenOn, photographer; `projectId` null = artist's own gallery.
- **user**, **session**: auth (see below).

Conventions:

- Integer autoincrement IDs; slugs for URLs (song/release slugs unique per project).
- **Fuzzy dates** as text `'YYYY' | 'YYYY-MM' | 'YYYY-MM-DD'`, enforced by a `GLOB` CHECK constraint; sorts correctly as text.
- `status` draft/published on content; `position` for manual ordering (drag-and-drop in CMS).
- Delete rules: parent → children `cascade`; deleting a credited person is `restrict`; optional asset references `set null`.
- Relations live in `src/lib/server/db/relations/[entity].ts`, one file per entity, exported from `relations/index.ts`. Every table is exported from `schemas/index.ts`. `createDatabase` (`db/factory.ts`) loads tables and relations together, so `db.query` can follow any relation.

### Agreed changes to the content model (2026-11-14, not implemented yet)

The domain language is defined in `GLOSSARY.md`; the Song/Recording decision is in `docs/adr/0001-song-and-recording-are-separate.md`. The schema above still describes the old model. To bring it in line:

- New **recording** table: one audio version of a song. Takes `audioAssetId`, `downloadable`, `producedOn` (rename to `recordedOn`) and its own `status` from `song`; gains `kind` (studio/demo/live) and an optional version label.
- **song** keeps title, lyrics, notes, `writtenOn`, status, and still belongs to one project; gains an optional main recording. A song may have no recordings.
- **release_track** points at a recording instead of a song. Every recording on a release belongs to the release's own project.
- **song_credit** keeps only `lyricist` and `composer` (`writer` is dropped; "Written by" is a display rule). New **recording_credit**: `producer`, `mixing engineer`, `mastering engineer`, `performer` (with a free-text detail).
- Visibility: content is public only when it and everything it hangs off are published; a release cannot be published while any of its recordings is a draft.

## Auth (implemented)

- One admin user. Passwords hashed with `node:crypto` scrypt (N=2^17, r=8, p=1), stored as `scrypt$N$r$p$salt$hash`, NFKC-normalized, `timingSafeEqual`, dummy hash for unknown usernames.
- DB sessions, not JWT. Cookie holds a random 32-byte token; DB stores only its SHA-256. 30-day sliding expiry, cookie re-set only when renewed (<15 days left), HttpOnly, SameSite=Lax.
- `src/hooks.server.ts` is a thin entry: `init` (deletes expired sessions) + `handle = sequence(authHandle)`; logic in `src/hooks/auth.ts`. Protects everything under `/admin` except `/admin/login`.
- First-run `/setup` creates the admin when no user exists (transactional check + insert). `safeRedirect` blocks open redirects in `redirectTo`.
- Files: `src/lib/server/auth/utils/{password,session}.ts`, `src/lib/server/auth/redirect.ts`, routes `setup/`, `admin/login/`, `admin/+layout.server.ts`, `admin/+page.svelte`, `logout/`.

## Offline / player (planned)

- Client-first. Users can **download** songs (route with `Content-Disposition`, per-song `downloadable` flag, MP3 or lossless original) and separately **make content available offline**.
- Storage: Cache Storage + hand-written service worker for app shell/images/audio; IndexedDB for content metadata, offline inventory and queue state; localStorage only for tiny prefs (volume, last track).
- Offline levels: whole site, per project, per release, and the **player**.
- **Player**: a `/player` route in its own route group with a minimal layout; shared player component + store used by both the site's persistent mini-player and `/player`. Listeners reorder the queue (drag) and skip songs; queue state in IndexedDB, with "Reset order".
- If only the player is saved offline, offline navigation falls back to `/player` ("You're offline, showing your saved music"), else to an offline page.
- Must handle: range requests from cache (service worker slices the blob and returns 206), `navigator.storage.persist()` / `estimate()`, Safari/iOS quotas, cache versioning per build, content-hashed media URLs. Show size before saving, progress, and "Clear offline data" globally and per item.

## Open items (found in review on 2026-11-10)

1. **Logout is broken**: the dashboard form posts to `/admin/logout`, but the route lives at `src/routes/logout/`. Move it to `src/routes/admin/logout/` (or change the form action).
2. **Login page has no `+page.svelte`**: `src/routes/admin/login/` only has the server file. Same shape as setup, with `autocomplete="current-password"`.
3. Run the 6 manual auth checks (redirect chain to /setup, setup once only, redirectTo round-trip, `//example.com` blocked, HttpOnly cookie, hashed session id in db:studio).
4. Consider running migrations at startup in `init` (`migrate(db, { migrationsFolder: 'drizzle' })` from `drizzle-orm/better-sqlite3/migrator`) so self-hosters never hit "no such table". Requires shipping `drizzle/` in the Docker image.
5. Optional cleanup: `src/lib/vitest-examples/`, route `src/routes/page.svelte.e2e.ts` scaffold test.

## Later (known gaps)

- Login rate limiting (e.g. 5/min per IP, in memory).
- `SETUP_TOKEN` env var required by `/setup` before the first public release, so nobody else can claim a fresh instance.
- Move protected admin pages into a `(protected)` route group once the admin gets a sidebar, so `/admin/login` doesn't render it.

## Roadmap

1. Finish auth (open items above) → 2. asset upload + storage interface (images with sharp, audio with ffmpeg) → 3. CMS CRUD: site, people, projects, releases, songs, credits, photos → 4. public site (project pages, release pages, song pages, galleries) + persistent mini-player → 5. `/player` + queue → 6. service worker + offline levels → 7. downloads → 8. Dockerfile + docs for self-hosters.

## Repo description (suggested)

> Self-hosted music portfolio for artists with multiple projects. Built-in CMS for bands, solo work, songs, credits and photo galleries, with an offline-ready player. SvelteKit + SQLite, one Docker container.

Topics: music, self-hosted, portfolio, cms, sveltekit, sqlite, pwa, offline-first, audio-player, musicians.

## Agent skills

### Issue tracker

Issues are tracked in GitHub Issues for `alessiogs/music-portfolio` via the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Default vocabulary: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `GLOSSARY.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.
