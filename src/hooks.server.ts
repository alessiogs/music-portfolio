import { sequence, type ServerInit } from '@sveltejs/kit/hooks';
import { authHandle } from './hooks/auth';
import { deleteExpiredSessions } from '#lib/server/auth/utils/session.ts';

export const init: ServerInit = () => {
	deleteExpiredSessions();
};

export const handle = sequence(authHandle);
