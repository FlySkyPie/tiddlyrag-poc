import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('wiki')
    .addColumn('uid', 'serial', (cb) => cb.primaryKey())
    .addColumn('id', 'varchar(500)', (cb) => cb.notNull().unique())
    .addColumn('title', 'varchar(500)', (cb) => cb.notNull())
    .addColumn('subtitle', 'varchar(500)', (cb) => cb.notNull())
    .addColumn('description', 'text', (cb) => cb.notNull())
    .addColumn('embedding', sql`vector(1536)`)
    .execute();

  await db.schema
    .createIndex('wiki_embedding_idx')
    .on('wiki')
    .using('hnsw')
    .column('embedding')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropIndex('wiki_embedding_idx').execute();
  await db.schema.dropTable('wiki').execute();
}
