import { relations } from 'drizzle-orm';
import { asset, person, site } from '../schemas';

export const siteRelations = relations(site, ({ one }) => ({
	artist: one(person, { fields: [site.artistPersonId], references: [person.id] }),
	avatar: one(asset, { fields: [site.avatarAssetId], references: [asset.id] })
}));
