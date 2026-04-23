import { Selectable, Insertable, Updateable } from 'kysely';

export interface WikiTable {
  id: number;
  wiki_id: string;
  title: string;
  subtitle: string;
  description: string;
  embedding: number[];
}

export type Wiki = Selectable<WikiTable>;

export type NewWiki = Insertable<WikiTable>;

export type WikiUpdate = Updateable<WikiTable>;
