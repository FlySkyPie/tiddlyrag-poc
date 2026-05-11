import { RepoContentTable } from './repo-content';
import { RepoTable } from './repo';

export interface Database {
  repo: RepoTable;
  'repo-content': RepoContentTable;
}
