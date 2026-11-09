import { check, index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { asset } from './asset';
import { person } from './person';
import { project } from './project';
import { id } from '../utils/id';
import { fuzzyDate, fuzzyDateCheck, timestamps } from '../utils/dates';
import { position } from '../utils/position';
import { status } from '../utils/status';

export const photo = sqliteTable(
	'photo',
	{
		id: id(),
		assetId: integer()
			.notNull()
			.references(() => asset.id, { onDelete: 'cascade' }),
		projectId: integer().references(() => project.id, { onDelete: 'cascade' }),
		description: text(),
		takenOn: fuzzyDate(),
		photographerId: integer().references(() => person.id, { onDelete: 'set null' }),
		position: position(),
		status: status(),
		...timestamps
	},
	(t) => [
		index('photo_project_idx').on(t.projectId),
		check('photo_taken_on_format', fuzzyDateCheck(t.takenOn))
	]
);
