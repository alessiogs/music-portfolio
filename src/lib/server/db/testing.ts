import { fileURLToPath } from 'node:url';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { createDatabase } from './factory.ts';

// The committed migrations at the repo root.
const migrationsFolder = fileURLToPath(new URL('../../../../drizzle', import.meta.url));

/**
 * Test helper: a fresh in-memory database built from the committed
 * migrations. Call it once per test so tests never share data.
 */
export function createTestDatabase() {
	const db = createDatabase(':memory:');
	migrate(db, { migrationsFolder });
	return db;
}
