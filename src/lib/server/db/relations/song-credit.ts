import { relations } from 'drizzle-orm';
import { person, song } from '../schemas';
import { songCredit } from '../schemas/song-credit';

export const songCreditRelations = relations(songCredit, ({ one }) => ({
	song: one(song, { fields: [songCredit.songId], references: [song.id] }),
	person: one(person, { fields: [songCredit.personId], references: [person.id] })
}));
