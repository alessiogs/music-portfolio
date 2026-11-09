import { relations } from 'drizzle-orm';
import { asset } from './asset';
import { person } from './person';
import { photo } from './photo';
import { project } from './project';

export const photoRelations = relations(photo, ({ one }) => ({
	asset: one(asset, { fields: [photo.assetId], references: [asset.id] }),
	project: one(project, { fields: [photo.projectId], references: [project.id] }),
	photographer: one(person, { fields: [photo.photographerId], references: [person.id] })
}));
