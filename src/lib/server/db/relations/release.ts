import { relations } from 'drizzle-orm';
import { asset, project, release } from '../schemas';
import { releaseTrack } from '../schemas/release-track';

export const releaseRelations = relations(release, ({ one, many }) => ({
	project: one(project, { fields: [release.projectId], references: [project.id] }),
	artwork: one(asset, { fields: [release.artworkAssetId], references: [asset.id] }),
	tracks: many(releaseTrack)
}));
