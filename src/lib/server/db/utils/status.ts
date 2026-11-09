import { text } from 'drizzle-orm/sqlite-core';

export const status = () =>
	text({ enum: ['draft', 'published'] })
		.notNull()
		.default('draft');
