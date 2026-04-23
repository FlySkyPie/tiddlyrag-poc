import { Selectable, Insertable, Updateable } from 'kysely';

export interface TiddlerTable {}

export type Tiddler = Selectable<TiddlerTable>;

export type NewTiddler = Insertable<TiddlerTable>;

export type TiddlerUpdate = Updateable<TiddlerTable>;
