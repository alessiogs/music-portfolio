import { sql, type SQL } from 'drizzle-orm';
import { integer, text, type AnySQLiteColumn } from 'drizzle-orm/sqlite-core';

export const timestamps = {
	createdAt: integer({ mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer({ mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdate(() => new Date())
};

/** Fuzzy date: 'YYYY', 'YYYY-MM' or 'YYYY-MM-DD'. Sorts correctly as text. */
export const fuzzyDate = () => text();

export const fuzzyDateCheck = (column: AnySQLiteColumn): SQL => sql`
	${column} IS NULL
	OR ${column} GLOB '[0-9][0-9][0-9][0-9]'
	OR ${column} GLOB '[0-9][0-9][0-9][0-9]-[01][0-9]'
	OR ${column} GLOB '[0-9][0-9][0-9][0-9]-[01][0-9]-[0-3][0-9]'
`;
