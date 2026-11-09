import {
	check,
	index,
	integer,
	primaryKey,
	sqliteTable,
	text,
	uniqueIndex
} from 'drizzle-orm/sqlite-core';
import { id } from '../utils/id';
import { project } from './project';
import { asset } from './asset';
import { fuzzyDate, fuzzyDateCheck, timestamps } from '../utils/dates';
import { status } from '../utils/status';
import { person } from './person';
import { position } from '../utils/position';

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

export const creditRoles = [
	'writer',
	'lyricist',
	'composer',
	'producer',
	'mixing',
	'mastering'
] as const;

export const songCredit = sqliteTable(
	'song_credit',
	{
		songId: integer()
			.notNull()
			.references(() => song.id, { onDelete: 'cascade' }),
		personId: integer()
			.notNull()
			.references(() => person.id, { onDelete: 'restrict' }),
		role: text({ enum: creditRoles }).notNull(),
		position: position()
	},
	(t) => [
		primaryKey({ columns: [t.songId, t.personId, t.role] }),
		index('song_credit_person_idx').on(t.personId)
	]
);
