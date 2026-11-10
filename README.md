# music-portfolio

> 🚧 **Work in progress.** Not ready for use yet: the data model and admin authentication are in place, and the CMS, the player and offline support are being built.

A self-hosted, open-source music portfolio for artists who have played in more than one project. Put every band and solo project on one site, each with its own bio, releases and photo gallery. Every song carries its credits: who wrote it, who produced it, and when it was written and recorded.

Everything is managed through a built-in CMS, so you can upload and edit your music, photos and texts yourself. Visitors can stream songs, download the ones you allow, and save the player or whole projects for offline listening.

One install is one artist: run your own copy and your files stay yours.

## Stack

SvelteKit, TypeScript, SQLite (better-sqlite3 + Drizzle ORM). It will ship as a single Docker image.

## Development

Requires Node.js 22.17 or newer.

```sh
npm install
cp .env.example .env    # sets DATABASE_URL=local.db
npm run db:migrate      # create the database
npm run dev
```

Open http://localhost:5173/setup to create the admin account, then manage content at `/admin`.

Other useful scripts: `npm run check` (type check), `npm run test:unit`, `npm run db:generate` (after schema changes), `npm run db:studio` (browse the database).

## Contributing

The project is at an early stage. For architecture, conventions and the roadmap, see [AGENTS.md](./AGENTS.md).
