import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import picomatch from 'picomatch';

import type { ContentsResponse } from './interfaces/contents-response';

@Injectable()
export class GiteaRepository {
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

  async migrate(repoUrl: string, repoName: string): Promise<unknown> {
    const url = new URL('/api/v1/repos/migrate', this.baseURL);

    const request = {
      clone_addr: repoUrl,
      repo_name: repoName,
    };
    const response = await this.httpService.axiosRef.post<unknown>(
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

  async readFilePaths(
    repoName: string,
    glob: string[] = ['**/*'],
  ): Promise<string[]> {
    const isMatch = picomatch(glob);
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

  async readFile(repoName: string, filepath: string): Promise<string> {
    const url = new URL(
      `/api/v1/repos/${this.user}/${repoName}/raw/${filepath}`,
      this.baseURL,
    );

    const response = await this.httpService.axiosRef.get<string>(url.href, {
      headers: {
        Authorization: `Basic ${this.credentials}`,
      },
    });

    return response.data;
  }
}
