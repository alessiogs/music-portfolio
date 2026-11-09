import { check, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { fuzzyDate, fuzzyDateCheck, timestamps } from '../utils/dates';
import { id } from '../utils/id';
import { status } from '../utils/status';
import { asset } from './asset';
import { project } from './project';

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
