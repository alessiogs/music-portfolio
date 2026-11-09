import { describe, expect, it } from 'vitest';
import { hashPassword, verifyPassword } from './password';

describe('password', () => {
	it('verifies the right password and rejects the wrong one', async () => {
		const hash = await hashPassword('correct horse battery');
		expect(hash.startsWith('scrypt$')).toBe(true);
		expect(await verifyPassword('correct horse battery', hash)).toBe(true);
		expect(await verifyPassword('wrong password', hash)).toBe(false);
	});

	it('produces a different hash each time (random salt)', async () => {
		expect(await hashPassword('same')).not.toBe(await hashPassword('same'));
	});

	it('rejects malformed hashes', async () => {
		expect(await verifyPassword('x', 'not-a-hash')).toBe(false);
	});
});
