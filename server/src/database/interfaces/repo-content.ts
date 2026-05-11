import { Selectable, Insertable, Updateable, Generated } from 'kysely';

export interface RepoContentTable {
  id: Generated<number>;
  filename: string;
  path: string;
  content: string;
  embedding: number[];
  repo_uid: number;
}

export type RepoContent = Selectable<RepoContentTable>;

export type NewRepoContent = Insertable<RepoContentTable>;

export type RepoContentUpdate = Updateable<RepoContentTable>;
