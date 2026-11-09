import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { id } from '../utils/id';
import { timestamps } from '../utils/dates';

export const user = sqliteTable('user', {
	id: id(),
	username: text().notNull().unique(), // stored lowercase
	passwordHash: text().notNull(),
	...timestamps
});
