import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { id } from '../utils/id';
import { project } from './project';
import { person } from './person';
import { fuzzyDate } from '../utils/dates';
import { position } from '../utils/position';

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
