import { Selectable, Insertable, Updateable, Generated } from 'kysely';

export interface RepoTable {
  uid: Generated<number>;
  id: string;
}

export type Repo = Selectable<RepoTable>;

export type NewRepo = Insertable<RepoTable>;

export type RepoUpdate = Updateable<RepoTable>;
