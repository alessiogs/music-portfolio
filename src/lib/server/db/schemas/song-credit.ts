import { index, integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { song } from './song';
import { person } from './person';
import { position } from '../utils/position';
import { creditRoles } from '../constants/song-credit';

export const songCredit = sqliteTable(
	'song_credit',
	{
		songId: integer()
			.notNull()
			.references(() => song.id, { onDelete: 'cascade' }),
		personId: integer()
			.notNull()
			.references(() => person.id, { onDelete: 'restrict' }),
		role: text({ enum: creditRoles }).notNull(),
		position: position()
	},
	(t) => [
		primaryKey({ columns: [t.songId, t.personId, t.role] }),
		index('song_credit_person_idx').on(t.personId)
	]
);
