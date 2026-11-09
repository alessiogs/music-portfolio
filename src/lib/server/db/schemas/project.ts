import { check, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { fuzzyDate, fuzzyDateCheck, timestamps } from '../utils/dates';
import { id } from '../utils/id';
import { position } from '../utils/position';
import { status } from '../utils/status';
import { asset } from './asset';

export const project = sqliteTable(
	'project',
	{
		id: id(),
		slug: text().notNull().unique(),
		name: text().notNull(),
		kind: text({ enum: ['band', 'solo'] }).notNull(),
		bio: text(),
		activeFrom: fuzzyDate(),
		activeTo: fuzzyDate(), // null = still active
		coverAssetId: integer().references(() => asset.id, { onDelete: 'set null' }),
		position: position(),
		status: status(),
		...timestamps
	},
	(t) => [
		check('project_active_from_format', fuzzyDateCheck(t.activeFrom)),
		check('project_active_to_format', fuzzyDateCheck(t.activeTo))
	]
);
