import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  /**
   * @todo Implement following DDL with kysely
   */
  // CREATE TABLE public.wiki (
  // 	uid serial4 NOT NULL,
  // 	id varchar(500) NOT NULL,
  // 	title varchar(500) NOT NULL,
  // 	subtitle varchar(500) NOT NULL,
  // 	description text NOT NULL,
  // 	embedding public.vector NOT NULL,
  // 	CONSTRAINT "PK_25a44ba2e459bcafa465ca1a71c" PRIMARY KEY (uid),
  // 	CONSTRAINT "UQ_c021a14e8072245b6d24f069ace" UNIQUE (id)
  // );
  // Migration code
}

export async function down(db: Kysely<any>): Promise<void> {
  // Migration code
}
