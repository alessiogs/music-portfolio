import { relations } from 'drizzle-orm';
import { releaseTrack } from '../schemas/release-track';
import { release, song } from '../schemas';

export const releaseTrackRelations = relations(releaseTrack, ({ one }) => ({
	release: one(release, { fields: [releaseTrack.releaseId], references: [release.id] }),
	song: one(song, { fields: [releaseTrack.songId], references: [song.id] })
}));
