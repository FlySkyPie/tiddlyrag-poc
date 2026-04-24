import { Selectable, Insertable, Updateable, Generated } from 'kysely';

export interface WikiTable {
  uid: Generated<number>;
  id: string;
  title: string;
  subtitle: string;
  description: string;
  embedding: number[];
}

export type Wiki = Selectable<WikiTable>;

export type NewWiki = Insertable<WikiTable>;

export type WikiUpdate = Updateable<WikiTable>;
