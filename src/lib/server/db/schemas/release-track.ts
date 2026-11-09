import { index, integer, primaryKey, sqliteTable } from 'drizzle-orm/sqlite-core';
import { release } from './release';
import { song } from './song';

export const releaseTrack = sqliteTable(
	'release_track',
	{
		releaseId: integer()
			.notNull()
			.references(() => release.id, { onDelete: 'cascade' }),
		songId: integer()
			.notNull()
			.references(() => song.id, { onDelete: 'cascade' }),
		disc: integer().notNull().default(1),
		position: integer().notNull()
	},
	(t) => [
		primaryKey({ columns: [t.releaseId, t.songId] }),
		index('release_track_song_idx').on(t.songId)
	]
);
