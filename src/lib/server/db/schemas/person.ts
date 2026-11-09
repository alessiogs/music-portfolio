import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { timestamps } from '../utils/dates';
import { id } from '../utils/id';

export const person = sqliteTable('person', {
	id: id(),
	slug: text().notNull().unique(),
	name: text().notNull(),
	bio: text(),
	url: text(),
	...timestamps
});
