import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await sql`CREATE EXTENSION IF NOT EXISTS vector`.execute(db);

  await db.schema
    .createTable('wiki')
    .addColumn('uid', 'serial', (cb) => cb.primaryKey())
    .addColumn('id', 'varchar(500)', (cb) => cb.notNull().unique())
    .addColumn('title', 'varchar(500)', (cb) => cb.notNull())
    .addColumn('subtitle', 'varchar(500)', (cb) => cb.notNull())
    .addColumn('description', 'text', (cb) => cb.notNull())
    .addColumn('embedding', sql`vector`)
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('wiki').execute();
}
