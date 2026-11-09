import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '#lib/server/db/index.ts';
import { user } from '#lib/server/db/schemas/user.ts';
import { hashPassword } from '#lib/server/auth/utils/password.ts';
import { createSession, setSessionCookie } from '#lib/server/auth/utils/session.ts';

const hasUser = () => !!db.select({ id: user.id }).from(user).limit(1).get();

export const load: PageServerLoad = () => {
	if (hasUser()) redirect(303, '/admin/login');
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const username = String(data.get('username') ?? '')
			.trim()
			.toLowerCase();
		const password = String(data.get('password') ?? '');
		const confirm = String(data.get('confirm') ?? '');

		if (!/^[a-z0-9_.-]{3,32}$/.test(username)) {
			return fail(400, { username, message: 'Username: 3–32 letters, numbers, _ . -' });
		}
		if (password.length < 12) {
			return fail(400, { username, message: 'Password must be at least 12 characters.' });
		}
		if (password !== confirm) {
			return fail(400, { username, message: 'Passwords do not match.' });
		}

		const passwordHash = await hashPassword(password);

		// better-sqlite3 transactions are synchronous, which is why we hash first.
		// The check + insert are atomic, so two simultaneous setups can't both succeed.
		const created = db.transaction((tx) => {
			if (tx.select({ id: user.id }).from(user).limit(1).get()) return null;
			return tx.insert(user).values({ username, passwordHash }).returning({ id: user.id }).get();
		});

		if (!created) redirect(303, '/admin/login');

		const { token, expiresAt } = createSession(created.id);
		setSessionCookie(cookies, token, expiresAt);
		redirect(303, '/admin');
	}
};
