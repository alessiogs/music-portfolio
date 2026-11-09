import { relations } from 'drizzle-orm';
import { asset, site } from '../schemas';

export const siteRelations = relations(site, ({ one }) => ({
	avatar: one(asset, { fields: [site.avatarAssetId], references: [asset.id] })
}));
