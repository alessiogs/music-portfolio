import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schemas';
import { DATABASE_URL } from '$app/env/private';

if (!DATABASE_URL) throw new Error('DATABASE_URL is not set');

const client = new Database(DATABASE_URL);
client.pragma('journal_mode = WAL'); // readers don't block the writer
client.pragma('foreign_keys = ON'); // off by default in SQLite!
client.pragma('busy_timeout = 5000'); // wait instead of failing on a lock

export const db = drizzle(client, { schema, casing: 'snake_case' });
