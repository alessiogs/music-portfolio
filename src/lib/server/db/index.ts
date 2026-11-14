import { DATABASE_URL } from '$app/env/private';
import { createDatabase } from './factory.ts';

if (!DATABASE_URL) throw new Error('DATABASE_URL is not set');

// The application singleton: the configured database, opened once.
export const db = createDatabase(DATABASE_URL);
