export function safeRedirect(target: string | null, fallback = '/admin') {
	if (!target || !target.startsWith('/') || target.startsWith('//')) return fallback;
	return target;
}
