import { randomBytes, scrypt, timingSafeEqual, type ScryptOptions } from 'node:crypto';

// OWASP-recommended scrypt cost. Memory used ≈ 128 * N * r bytes (128 MB here).
const N = 2 ** 17;
const R = 8;
const P = 1;
const KEY_LENGTH = 64;

// util.promisify loses the options overload in the types, so wrap it by hand.
function scryptAsync(password: string, salt: Buffer, keylen: number, options: ScryptOptions) {
	return new Promise<Buffer>((resolve, reject) => {
		scrypt(password, salt, keylen, options, (err, key) => (err ? reject(err) : resolve(key)));
	});
}

const maxmem = (n: number, r: number) => 256 * n * r; // headroom above the 128*N*r minimum

export async function hashPassword(password: string): Promise<string> {
	const salt = randomBytes(16);
	const key = await scryptAsync(password.normalize('NFKC'), salt, KEY_LENGTH, {
		N,
		r: R,
		p: P,
		maxmem: maxmem(N, R)
	});
	return ['scrypt', N, R, P, salt.toString('base64'), key.toString('base64')].join('$');
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
	const parts = stored.split('$');
	if (parts.length !== 6 || parts[0] !== 'scrypt') return false;

	const [, n, r, p, saltB64, keyB64] = parts;
	const expected = Buffer.from(keyB64, 'base64');
	const actual = await scryptAsync(
		password.normalize('NFKC'),
		Buffer.from(saltB64, 'base64'),
		expected.length,
		{
			N: Number(n),
			r: Number(r),
			p: Number(p),
			maxmem: maxmem(Number(n), Number(r))
		}
	);
	return timingSafeEqual(actual, expected);
}

// Used when the username doesn't exist, so a failed login takes the same time
// either way and doesn't reveal which usernames are valid.
let dummyHash: Promise<string> | undefined;
export const getDummyHash = () => (dummyHash ??= hashPassword(randomBytes(16).toString('hex')));
