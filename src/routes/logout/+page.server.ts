import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
	SESSION_COOKIE,
	deleteSessionCookie,
	invalidateSession
} from '#lib/server/auth/utils/session.ts';

export const load: PageServerLoad = () => redirect(303, '/admin');

export const actions: Actions = {
	default: ({ cookies }) => {
		const token = cookies.get(SESSION_COOKIE);
		if (token) invalidateSession(token);
		deleteSessionCookie(cookies);
		redirect(303, '/admin/login');
	}
};
