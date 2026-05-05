import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await sql`CREATE EXTENSION IF NOT EXISTS vector`.execute(db);

  await db.schema
    .createTable('repo-content')
    .addColumn('id', 'serial', (cb) => cb.primaryKey())
    .addColumn('filename', 'varchar(500)', (cb) => cb.notNull())
    .addColumn('path', 'text', (cb) => cb.notNull())
    .addColumn('content', 'text', (cb) => cb.notNull())
    .addColumn('embedding', sql`vector`)
    .addColumn('repo_uid', 'integer', (cb) =>
      cb.references('repo.uid').onDelete('cascade'),
    )
    .execute();

  await db.schema
    .createIndex('tiddler_repo_uid_idx')
    .on('repo-content')
    .column('repo_uid')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropIndex('tiddler_repo_uid_idx').execute();
  await db.schema.dropTable('repo-content').execute();
}
