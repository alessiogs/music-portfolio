import { check, index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { asset } from './asset';
import { person } from './person';
import { id } from '../utils/id';
import { fuzzyDate, fuzzyDateCheck, timestamps } from '../utils/dates';
import { position } from '../utils/position';
import { status } from '../utils/status';

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

export const projectMember = sqliteTable(
	'project_member',
	{
		id: id(),
		projectId: integer()
			.notNull()
			.references(() => project.id, { onDelete: 'cascade' }),
		personId: integer()
			.notNull()
			.references(() => person.id, { onDelete: 'restrict' }),
		role: text(), // free text: "vocals, rhythm guitar"
		activeFrom: fuzzyDate(),
		activeTo: fuzzyDate(),
		position: position()
	},
	(t) => [
		index('project_member_project_idx').on(t.projectId),
		index('project_member_person_idx').on(t.personId)
	]
);
