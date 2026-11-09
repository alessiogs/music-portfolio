import { relations } from 'drizzle-orm';
import { session, user } from '../schemas';

export const sessionRelations = relations(session, ({ one }) => ({
	user: one(user, { fields: [session.userId], references: [user.id] })
}));
