import { sql } from 'drizzle-orm';
import { check, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { asset } from './asset';
import { timestamps } from '../utils/dates';

export type SiteLink = { label: string; url: string };

export const site = sqliteTable(
	'site',
	{
		id: integer().primaryKey(),
		artistName: text().notNull(),
		tagline: text(),
		bio: text(),
		avatarAssetId: integer().references(() => asset.id, { onDelete: 'set null' }),
		links: text({ mode: 'json' })
			.$type<SiteLink[]>()
			.notNull()
			.$defaultFn(() => []),
		...timestamps
	},
	(t) => [check('site_singleton', sql`${t.id} = 1`)]
);
