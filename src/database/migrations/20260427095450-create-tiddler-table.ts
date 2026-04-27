import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  /**
   * @todo Implement following DDL with kysely
   */
  //     CREATE TABLE public.tiddler (
  // 	id serial4 NOT NULL,
  // 	title varchar(500) NOT NULL,
  // 	"type" varchar(500) NULL,
  // 	"text" text NOT NULL,
  // 	tags _text NOT NULL,
  // 	meta jsonb NOT NULL,
  // 	embedding public.vector NOT NULL,
  // 	"wikiUid" int4 NULL,
  // 	CONSTRAINT "PK_a8d10660d8fd87190e548d6ded5" PRIMARY KEY (id),
  // 	CONSTRAINT "FK_c7466a6f1b30e090d20c2eee89d" FOREIGN KEY ("wikiUid") REFERENCES public.wiki(uid)
  // );
  // Migration code
}

export async function down(db: Kysely<any>): Promise<void> {
  // Migration code
}
