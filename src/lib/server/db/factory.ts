import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schemas';

/**
 * Opens the SQLite database at `location` (a file path, or `':memory:'`),
 * applies the connection pragmas and returns the Drizzle instance.
 *
 * This module must stay free of `$app/*` imports so it can be used outside
 * the running application (tests, scripts).
 */
export function createDatabase(location: string) {
	const client = new Database(location);
	client.pragma('journal_mode = WAL'); // readers don't block the writer
	client.pragma('foreign_keys = ON'); // off by default in SQLite!
	client.pragma('busy_timeout = 5000'); // wait instead of failing on a lock

	return drizzle(client, { schema, casing: 'snake_case' });
}

export type AppDatabase = ReturnType<typeof createDatabase>;
