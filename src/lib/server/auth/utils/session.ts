import { createHash, randomBytes } from 'node:crypto';
import { eq, lt } from 'drizzle-orm';
import type { Cookies } from '@sveltejs/kit';
import { db } from '../../db';
import { session, user } from '../../db/schemas';

const DAY = 24 * 60 * 60 * 1000;
const SESSION_TTL = 30 * DAY;
const RENEW_BELOW = 15 * DAY;

export const SESSION_COOKIE = 'session';

const hashToken = (token: string) => createHash('sha256').update(token).digest('hex');

export function createSession(userId: number) {
	const token = randomBytes(32).toString('base64url');
	const expiresAt = new Date(Date.now() + SESSION_TTL);
	db.insert(session)
		.values({ id: hashToken(token), userId, expiresAt })
		.run();
	return { token, expiresAt };
}

export function validateSession(token: string) {
	const id = hashToken(token);
	const row = db
		.select({
			user: { id: user.id, username: user.username },
			expiresAt: session.expiresAt
		})
		.from(session)
		.innerJoin(user, eq(session.userId, user.id))
		.where(eq(session.id, id))
		.get();

	if (!row) return null;

	if (row.expiresAt.getTime() <= Date.now()) {
		db.delete(session).where(eq(session.id, id)).run();
		return null;
	}

	if (row.expiresAt.getTime() - Date.now() < RENEW_BELOW) {
		const expiresAt = new Date(Date.now() + SESSION_TTL);
		db.update(session).set({ expiresAt }).where(eq(session.id, id)).run();
		return { user: row.user, expiresAt, renewed: true };
	}

	return { user: row.user, expiresAt: row.expiresAt, renewed: false };
}

export function invalidateSession(token: string) {
	db.delete(session)
		.where(eq(session.id, hashToken(token)))
		.run();
}

export function setSessionCookie(cookies: Cookies, token: string, expiresAt: Date) {
	cookies.set(SESSION_COOKIE, token, {
		path: '/',
		httpOnly: true, // JavaScript can't read it, so XSS can't steal it
		sameSite: 'lax',
		expires: expiresAt
		// `secure` defaults to true in SvelteKit, except on http://localhost
	});
}

export function deleteSessionCookie(cookies: Cookies) {
	cookies.delete(SESSION_COOKIE, { path: '/' });
}

export function deleteExpiredSessions() {
	db.delete(session).where(lt(session.expiresAt, new Date())).run();
}
