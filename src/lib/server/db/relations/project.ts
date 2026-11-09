import { relations } from 'drizzle-orm';
import { asset, photo, project, release, song } from '../schemas';
import { projectMember } from '../schemas/project-member';

export const projectRelations = relations(project, ({ one, many }) => ({
	cover: one(asset, { fields: [project.coverAssetId], references: [asset.id] }),
	members: many(projectMember),
	releases: many(release),
	songs: many(song),
	photos: many(photo)
}));
