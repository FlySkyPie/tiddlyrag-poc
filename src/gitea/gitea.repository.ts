import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GiteaRepository {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async migrate(repoUrl: string, repoName: string): Promise<unknown> {
    const baseURL = this.configService.get<string>('gitea.api_base')!;
    const url = new URL('/api/v1/repos/migrate', baseURL);

    const user = this.configService.get<string>('gitea.user')!;
    const password = this.configService.get<string>('gitea.password')!;
    const credentials = Buffer.from(`${user}:${password}`).toString('base64');

    const request = {
      clone_addr: repoUrl,
      repo_name: repoName,
    };
    const response = await this.httpService.axiosRef.post<unknown>(
      url.href,
      request,
      {
        headers: {
          Authorization: `Basic ${credentials}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return response.data;
  }
}
