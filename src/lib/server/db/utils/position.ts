import { integer } from 'drizzle-orm/sqlite-core';

export const position = () => integer().notNull().default(0);
