import { eq } from 'drizzle-orm';
import { describe, expect, it } from 'vitest';
import * as schema from './schemas/index.ts';
import { createTestDatabase } from './testing.ts';

function createPerson(db: ReturnType<typeof createTestDatabase>, name = 'Ada') {
	return db
		.insert(schema.person)
		.values({ name, bio: `${name} writes songs.` })
		.returning()
		.get();
}

describe('Site and its Artist', () => {
	it('lets a Site point at the Person who is the Artist, and reads their name and bio through it', () => {
		const db = createTestDatabase();
		const ada = createPerson(db);
		db.insert(schema.site).values({ id: 1, artistPersonId: ada.id, tagline: 'Songs' }).run();

		const found = db.query.site.findFirst({ with: { artist: true } }).sync();

		expect(found).toMatchObject({
			tagline: 'Songs',
			links: [],
			artist: { name: 'Ada', bio: 'Ada writes songs.' }
		});
	});

	it('refuses a Site without an Artist', () => {
		const db = createTestDatabase();

		expect(() =>
			db
				.insert(schema.site)
				// @ts-expect-error the Artist is required
				.values({ id: 1, tagline: 'Songs' })
				.run()
		).toThrow(/NOT NULL constraint failed: site\.artist_person_id/);
	});

	it('refuses a Site whose Artist is not an existing Person', () => {
		const db = createTestDatabase();

		expect(() => db.insert(schema.site).values({ id: 1, artistPersonId: 999 }).run()).toThrow(
			/FOREIGN KEY constraint failed/
		);
	});

	it('refuses a second Site row', () => {
		const db = createTestDatabase();
		const ada = createPerson(db);
		db.insert(schema.site).values({ id: 1, artistPersonId: ada.id }).run();

		expect(() => db.insert(schema.site).values({ id: 2, artistPersonId: ada.id }).run()).toThrow(
			/CHECK constraint failed: site_singleton/
		);
		expect(() => db.insert(schema.site).values({ id: 1, artistPersonId: ada.id }).run()).toThrow(
			/UNIQUE constraint failed: site\.id/
		);
		expect(db.select().from(schema.site).all()).toHaveLength(1);
	});

	it('refuses to delete the Person the Site points at', () => {
		const db = createTestDatabase();
		const ada = createPerson(db);
		db.insert(schema.site).values({ id: 1, artistPersonId: ada.id }).run();

		expect(() => db.delete(schema.person).where(eq(schema.person.id, ada.id)).run()).toThrow(
			/FOREIGN KEY constraint failed/
		);
		expect(db.select().from(schema.person).all()).toHaveLength(1);
	});
});

describe('Person', () => {
	it('has no slug: two Persons need only a name, and may share it', () => {
		const db = createTestDatabase();
		createPerson(db, 'Ada');
		createPerson(db, 'Ada');

		const people = db.select().from(schema.person).all();

		expect(people).toHaveLength(2);
		expect(people[0]).not.toHaveProperty('slug');
	});

	it('still refuses to delete a Person who holds a Membership', () => {
		const db = createTestDatabase();
		const ada = createPerson(db);
		const { id: projectId } = db
			.insert(schema.project)
			.values({ slug: 'the-band', name: 'The Band', kind: 'band' })
			.returning()
			.get();
		db.insert(schema.projectMember).values({ projectId, personId: ada.id, role: 'vocals' }).run();

		expect(() => db.delete(schema.person).where(eq(schema.person.id, ada.id)).run()).toThrow(
			/FOREIGN KEY constraint failed/
		);
		expect(db.select().from(schema.person).all()).toHaveLength(1);
	});
});
