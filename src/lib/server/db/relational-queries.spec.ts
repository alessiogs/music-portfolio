import { describe, expect, it } from 'vitest';
import * as schema from './schemas/index.ts';
import { createTestDatabase } from './testing.ts';

describe('relational queries', () => {
	it('reaches the Tracks of a Release and the Song of each Track', () => {
		const db = createTestDatabase();
		const { id: projectId } = db
			.insert(schema.project)
			.values({ slug: 'the-band', name: 'The Band', kind: 'band' })
			.returning()
			.get();
		const { id: releaseId } = db
			.insert(schema.release)
			.values({ projectId, slug: 'first', title: 'First', kind: 'album' })
			.returning()
			.get();
		const opener = db
			.insert(schema.song)
			.values({ projectId, slug: 'opener', title: 'Opener' })
			.returning()
			.get();
		const closer = db
			.insert(schema.song)
			.values({ projectId, slug: 'closer', title: 'Closer' })
			.returning()
			.get();
		db.insert(schema.releaseTrack)
			.values([
				{ releaseId, songId: closer.id, position: 2 },
				{ releaseId, songId: opener.id, position: 1 }
			])
			.run();

		const found = db.query.release
			.findFirst({
				where: (release, { eq }) => eq(release.id, releaseId),
				with: {
					tracks: {
						orderBy: (track, { asc }) => [asc(track.disc), asc(track.position)],
						with: { song: true }
					}
				}
			})
			.sync();

		expect(found).toMatchObject({
			title: 'First',
			tracks: [
				{ disc: 1, position: 1, song: { title: 'Opener' } },
				{ disc: 1, position: 2, song: { title: 'Closer' } }
			]
		});
	});

	it('reaches the Members of a Project and the Person of each Member', () => {
		const db = createTestDatabase();
		const { id: projectId } = db
			.insert(schema.project)
			.values({ slug: 'the-band', name: 'The Band', kind: 'band' })
			.returning()
			.get();
		const ada = db.insert(schema.person).values({ name: 'Ada' }).returning().get();
		const bruno = db.insert(schema.person).values({ name: 'Bruno' }).returning().get();
		db.insert(schema.projectMember)
			.values([
				{ projectId, personId: bruno.id, role: 'drums', position: 2 },
				{ projectId, personId: ada.id, role: 'vocals', position: 1 }
			])
			.run();

		const found = db.query.project
			.findFirst({
				where: (project, { eq }) => eq(project.id, projectId),
				with: {
					members: {
						orderBy: (member, { asc }) => [asc(member.position)],
						with: { person: true }
					}
				}
			})
			.sync();

		expect(found).toMatchObject({
			name: 'The Band',
			members: [
				{ role: 'vocals', person: { name: 'Ada' } },
				{ role: 'drums', person: { name: 'Bruno' } }
			]
		});
	});
});
