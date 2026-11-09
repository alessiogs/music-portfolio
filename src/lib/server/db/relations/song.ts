import { relations } from 'drizzle-orm';
import { asset, project, song } from '../schemas';
import { songCredit } from '../schemas/song-credit';
import { releaseTrack } from '../schemas/release-track';

export const songRelations = relations(song, ({ one, many }) => ({
	project: one(project, { fields: [song.projectId], references: [project.id] }),
	audio: one(asset, { fields: [song.audioAssetId], references: [asset.id] }),
	credits: many(songCredit),
	appearsOn: many(releaseTrack)
}));
