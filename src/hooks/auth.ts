import {
	deleteSessionCookie,
	SESSION_COOKIE,
	setSessionCookie,
	validateSession
} from '#lib/server/auth/utils/session.ts';
import { redirect } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit/hooks';

const PUBLIC_ADMIN_PATHS = new Set(['/admin/login']);

export const authHandle: Handle = async ({ event, resolve }) => {
	event.locals.user = null;

	const token = event.cookies.get(SESSION_COOKIE);
	if (token) {
		const result = validateSession(token);
		if (result) {
			event.locals.user = result.user;
			if (result.renewed) setSessionCookie(event.cookies, token, result.expiresAt);
		} else {
			deleteSessionCookie(event.cookies);
		}
	}

	const { pathname, search } = event.url;
	const isAdmin = pathname === '/admin' || pathname.startsWith('/admin/');

	if (isAdmin && !PUBLIC_ADMIN_PATHS.has(pathname) && !event.locals.user) {
		redirect(303, `/admin/login?redirectTo=${encodeURIComponent(pathname + search)}`);
	}

	return resolve(event);
};
