import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { id } from '../utils/id';
import { timestamps } from '../utils/dates';

export const asset = sqliteTable('asset', {
	id: id(),
	kind: text({ enum: ['image', 'audio'] }).notNull(),
	storageKey: text().notNull().unique(), // path relative to the media folder
	originalName: text().notNull(),
	mimeType: text().notNull(),
	sizeBytes: integer().notNull(),
	sha256: text().notNull(), // dedupe + cache-busting URLs
	width: integer(), // images
	height: integer(),
	durationMs: integer(), // audio
	createdAt: timestamps.createdAt
});
