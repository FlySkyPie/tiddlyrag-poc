import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('tiddler')
    .addColumn('id', 'serial', (cb) => cb.primaryKey())
    .addColumn('title', 'varchar(500)', (cb) => cb.notNull())
    .addColumn('type', 'varchar(500)')
    .addColumn('text', 'text', (cb) => cb.notNull())
    .addColumn('tags', sql`text[]`, (cb) => cb.notNull())
    .addColumn('meta', 'jsonb', (cb) => cb.notNull())
    .addColumn('embedding', sql`vector`)
    .addColumn('wikiUid', 'integer', (cb) =>
      cb.references('wiki.uid').onDelete('cascade'),
    )
    .execute();

  await db.schema
    .createIndex('tiddler_wikiUid_idx')
    .on('tiddler')
    .column('wikiUid')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropIndex('tiddler_wikiUid_idx').execute();
  await db.schema.dropTable('tiddler').execute();
}
