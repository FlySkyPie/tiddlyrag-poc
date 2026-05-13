import type { ContentsResponse } from 'gitea-js';

export interface IGiteaRepository {
  readPath(repoName: string, filepath?: string): Promise<ContentsResponse[]>;

  readFile(repoName: string, filepath: string): Promise<string>;
}
