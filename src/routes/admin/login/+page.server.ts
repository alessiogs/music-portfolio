import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { safeRedirect } from '#lib/server/auth/redirect.ts';
import { db } from '#lib/server/db/index.ts';
import { user } from '#lib/server/db/schemas/user.ts';
import { getDummyHash, verifyPassword } from '#lib/server/auth/utils/password.ts';
import { createSession } from '#lib/server/auth/utils/session.ts';
import { setSessionCookie } from '#lib/server/auth/utils/session.ts';

export const load: PageServerLoad = ({ locals, url }) => {
	if (locals.user) redirect(303, safeRedirect(url.searchParams.get('redirectTo')));
	if (!db.select({ id: user.id }).from(user).limit(1).get()) redirect(303, '/setup');
};

export const actions: Actions = {
	default: async ({ request, cookies, url }) => {
		const data = await request.formData();
		const username = String(data.get('username') ?? '')
			.trim()
			.toLowerCase();
		const password = String(data.get('password') ?? '');

		if (!username || !password) {
			return fail(400, { username, message: 'Enter your username and password.' });
		}

		const found = db.select().from(user).where(eq(user.username, username)).get();
		const valid = await verifyPassword(password, found?.passwordHash ?? (await getDummyHash()));

		// Same message for both cases: don't reveal whether the username exists.
		if (!found || !valid) {
			return fail(400, { username, message: 'Invalid username or password.' });
		}

		const { token, expiresAt } = createSession(found.id);
		setSessionCookie(cookies, token, expiresAt);
		redirect(303, safeRedirect(url.searchParams.get('redirectTo')));
	}
};
