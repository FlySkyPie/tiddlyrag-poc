import { Selectable, Insertable, Updateable } from 'kysely';

export interface WikiTable {}

export type Wiki = Selectable<WikiTable>;

export type NewWiki = Insertable<WikiTable>;

export type WikiUpdate = Updateable<WikiTable>;
