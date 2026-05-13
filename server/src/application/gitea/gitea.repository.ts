import type {
  ContentsResponse,
  Repository,
  MigrateRepoOptions,
} from 'gitea-js';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import picomatch from 'picomatch';

import type { IGiteaRepository } from '../../core/repository/gitea.repository';

@Injectable()
export class GiteaRepository implements IGiteaRepository {
  private readonly credentials: string;
  private readonly user: string;
  private readonly baseURL: string;
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.user = this.configService.get<string>('gitea.user')!;
    const password = this.configService.get<string>('gitea.password')!;
    this.credentials = Buffer.from(`${this.user}:${password}`).toString(
      'base64',
    );

    this.baseURL = this.configService.get<string>('gitea.api_base')!;
  }

  /**
   * Download a git repo from remote and stored into Gitea instance.
   */
  async migrate(repoUrl: string, repoName: string): Promise<Repository> {
    const url = new URL('/api/v1/repos/migrate', this.baseURL);

    const request: MigrateRepoOptions = {
      clone_addr: repoUrl,
      repo_name: repoName,
    };
    const response = await this.httpService.axiosRef.post<Repository>(
      url.href,
      request,
      {
        headers: {
          Authorization: `Basic ${this.credentials}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return response.data;
  }

  /**
   * Read contents from stored repo.
   */
  async readPath(
    repoName: string,
    filepath = '.',
  ): Promise<ContentsResponse[]> {
    const url = new URL(
      `/api/v1/repos/${this.user}/${repoName}/contents/${filepath}`,
      this.baseURL,
    );

    const response = await this.httpService.axiosRef.get<ContentsResponse[]>(
      url.href,
      {
        headers: {
          Authorization: `Basic ${this.credentials}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return response.data;
  }

  /**
   * Read file paths from stored repo.
   */
  async readFilePaths(
    repoName: string,
    glob: string[] = ['**/*'],
    ignore?: string[],
  ): Promise<string[]> {
    const isMatch = picomatch(glob, { ignore });
    const files: string[] = [];
    const pendingPaths: string[] = ['.'];
    while (pendingPaths.length) {
      const path = pendingPaths.pop();
      if (!path) {
        break;
      }
      const contents = await this.readPath(repoName, path);
      for (let index = 0; index < contents.length; index++) {
        const element = contents[index];
        if (element.type === 'file') {
          const _path = element.path!;
          if (isMatch(_path)) files.push(_path);
        }
        if (element.type === 'dir') {
          pendingPaths.push(element.path!);
        }
      }
    }
    return files;
  }

  /**
   * Read conent of a file from stored repo.
   */
  async readFile(repoName: string, filepath: string): Promise<string> {
    const url = new URL(
      `/api/v1/repos/${this.user}/${repoName}/raw/${filepath}`,
      this.baseURL,
    );

    const response = await this.httpService.axiosRef.get<string>(url.href, {
      headers: {
        Authorization: `Basic ${this.credentials}`,
      },
      /**
       * Prevent JSON response been parsed
       * @link https://github.com/axios/axios/issues/907#issuecomment-373988087
       */
      transformResponse: [
        (data: any) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return data;
        },
      ],
    });

    return response.data;
  }
}
