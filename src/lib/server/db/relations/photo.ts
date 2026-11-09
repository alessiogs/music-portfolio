import { relations } from 'drizzle-orm';
import { asset, person, photo, project } from '../schemas';

export const photoRelations = relations(photo, ({ one }) => ({
	asset: one(asset, { fields: [photo.assetId], references: [asset.id] }),
	project: one(project, { fields: [photo.projectId], references: [project.id] }),
	photographer: one(person, { fields: [photo.photographerId], references: [person.id] })
}));
