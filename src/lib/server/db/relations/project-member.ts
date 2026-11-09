import { relations } from 'drizzle-orm';
import { projectMember } from '../schemas/project-member';
import { person, project } from '../schemas';

export const projectMemberRelations = relations(projectMember, ({ one }) => ({
	project: one(project, { fields: [projectMember.projectId], references: [project.id] }),
	person: one(person, { fields: [projectMember.personId], references: [person.id] })
}));
