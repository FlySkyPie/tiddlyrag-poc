import { Selectable, Insertable, Updateable } from 'kysely';

export interface TiddlerTable {
  id: number;
  title: string;
  type: string | null;
  text: string;
  tags: string[];
  meta: Record<string, unknown>;
  embedding: number[];
  wikiUid: number;
}

export type Tiddler = Selectable<TiddlerTable>;

export type NewTiddler = Insertable<TiddlerTable>;

export type TiddlerUpdate = Updateable<TiddlerTable>;
