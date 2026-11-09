import { integer } from 'drizzle-orm/sqlite-core';

export const id = () => integer().primaryKey({ autoIncrement: true });
