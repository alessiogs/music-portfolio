import { check, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { fuzzyDate, fuzzyDateCheck, timestamps } from '../utils/dates';
import { id } from '../utils/id';
import { status } from '../utils/status';
import { asset } from './asset';
import { project } from './project';

export const song = sqliteTable(
	'song',
	{
		id: id(),
		projectId: integer()
			.notNull()
			.references(() => project.id, { onDelete: 'cascade' }),
		slug: text().notNull(),
		title: text().notNull(),
		audioAssetId: integer().references(() => asset.id, { onDelete: 'set null' }),
		writtenOn: fuzzyDate(),
		producedOn: fuzzyDate(),
		lyrics: text(),
		notes: text(),
		downloadable: integer({ mode: 'boolean' }).notNull().default(false),
		status: status(),
		...timestamps
	},
	(t) => [
		uniqueIndex('song_project_slug_idx').on(t.projectId, t.slug),
		check('song_written_on_format', fuzzyDateCheck(t.writtenOn)),
		check('song_produced_on_format', fuzzyDateCheck(t.producedOn))
	]
);
