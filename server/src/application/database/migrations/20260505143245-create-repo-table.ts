import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('repo')
    .addColumn('uid', 'serial', (cb) => cb.primaryKey())
    .addColumn('id', 'varchar(500)', (cb) => cb.notNull().unique())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('repo').execute();
}
