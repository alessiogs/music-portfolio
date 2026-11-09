import { relations } from 'drizzle-orm';
import { session, user } from '../schemas';

export const userRelations = relations(user, ({ many }) => ({
	sessions: many(session)
}));
