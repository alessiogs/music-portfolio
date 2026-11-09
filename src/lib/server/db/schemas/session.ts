import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { user } from './user';
import { timestamps } from '../utils/dates';

export const session = sqliteTable(
	'session',
	{
		id: text().primaryKey(), // sha256(token), never the token itself
		userId: integer()
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		expiresAt: integer({ mode: 'timestamp' }).notNull(),
		createdAt: timestamps.createdAt
	},
	(t) => [index('session_user_idx').on(t.userId)]
);
