import { relations } from 'drizzle-orm';
import { person } from '../schemas';
import { projectMember } from '../schemas/project-member';
import { songCredit } from '../schemas/song-credit';

export const personRelations = relations(person, ({ many }) => ({
	memberships: many(projectMember),
	credits: many(songCredit)
}));
