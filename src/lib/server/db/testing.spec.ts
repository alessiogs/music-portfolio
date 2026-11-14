import { beforeAll, describe, expect, it } from 'vitest';
import * as schema from './schemas';
import { createTestDatabase } from './testing.ts';

describe('test database', () => {
	beforeAll(() => {
		// The helper must not depend on the configured database.
		delete process.env.DATABASE_URL;
	});

	it('builds a database from the committed migrations with no DATABASE_URL and no file', () => {
		const db = createTestDatabase();

		expect(process.env.DATABASE_URL).toBeUndefined();
		expect(db.$client.memory).toBe(true);

		db.insert(schema.project).values({ slug: 'the-band', name: 'The Band', kind: 'band' }).run();

		expect(db.select().from(schema.project).all()).toMatchObject([
			{ id: 1, slug: 'the-band', name: 'The Band', kind: 'band', status: 'draft' }
		]);
	});

	it('applies the migrations cleanly to an empty database: every table exists and is empty', () => {
		const db = createTestDatabase();

		expect(db.select().from(schema.asset).all()).toEqual([]);
		expect(db.select().from(schema.person).all()).toEqual([]);
		expect(db.select().from(schema.photo).all()).toEqual([]);
		expect(db.select().from(schema.project).all()).toEqual([]);
		expect(db.select().from(schema.projectMember).all()).toEqual([]);
		expect(db.select().from(schema.release).all()).toEqual([]);
		expect(db.select().from(schema.releaseTrack).all()).toEqual([]);
		expect(db.select().from(schema.songCredit).all()).toEqual([]);
		expect(db.select().from(schema.session).all()).toEqual([]);
		expect(db.select().from(schema.site).all()).toEqual([]);
		expect(db.select().from(schema.song).all()).toEqual([]);
		expect(db.select().from(schema.user).all()).toEqual([]);
	});

	it('gives each test its own fresh database', () => {
		const first = createTestDatabase();
		const second = createTestDatabase();

		first.insert(schema.project).values({ slug: 'solo', name: 'Solo', kind: 'solo' }).run();

		expect(first.select().from(schema.project).all()).toHaveLength(1);
		expect(second.select().from(schema.project).all()).toEqual([]);
	});

	it('enforces foreign keys', () => {
		const db = createTestDatabase();

		expect(() =>
			db
				.insert(schema.release)
				.values({ projectId: 999, slug: 'orphan', title: 'Orphan', kind: 'album' })
				.run()
		).toThrow(/FOREIGN KEY constraint failed/);
	});

	it('removes children when their parent is deleted', () => {
		const db = createTestDatabase();
		const { id: projectId } = db
			.insert(schema.project)
			.values({ slug: 'the-band', name: 'The Band', kind: 'band' })
			.returning()
			.get();
		db.insert(schema.release)
			.values({ projectId, slug: 'first', title: 'First', kind: 'album' })
			.run();

		db.delete(schema.project).run();

		expect(db.select().from(schema.release).all()).toEqual([]);
	});
});
