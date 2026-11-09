import {
	check,
	index,
	integer,
	primaryKey,
	sqliteTable,
	text,
	uniqueIndex
} from 'drizzle-orm/sqlite-core';
import { asset } from './asset';
import { project } from './project';
import { song } from './song';
import { id } from '../utils/id';
import { fuzzyDate, fuzzyDateCheck, timestamps } from '../utils/dates';
import { status } from '../utils/status';

export const release = sqliteTable(
	'release',
	{
		id: id(),
		projectId: integer()
			.notNull()
			.references(() => project.id, { onDelete: 'cascade' }),
		slug: text().notNull(),
		title: text().notNull(),
		kind: text({ enum: ['album', 'ep', 'single', 'live', 'compilation'] }).notNull(),
		releasedOn: fuzzyDate(),
		description: text(),
		artworkAssetId: integer().references(() => asset.id, { onDelete: 'set null' }),
		status: status(),
		...timestamps
	},
	(t) => [
		uniqueIndex('release_project_slug_idx').on(t.projectId, t.slug),
		check('release_released_on_format', fuzzyDateCheck(t.releasedOn))
	]
);

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
