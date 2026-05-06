import { resolve } from 'node:path';

import type {
  ChatCompletion,
  ChatCompletionCreateParamsBase,
} from 'openai/resources/chat/completions';
import type { Environment } from 'nunjucks';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nunjucks from 'nunjucks';

@Injectable()
export class LlmService {
  private readonly environment: Environment;
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.environment = nunjucks.configure(resolve(__dirname, './prompts'));
  }

  public async createWikiStructure(): Promise<string> {
    const result = this.environment.render('stage-1.md', {
      repo_type: 'github',
      repo_url: 'https://github.com/FlySkyPie/ariadne-gis',
      repo_name: 'ariadne-gis',
      language_name: 'Traditional Chinese (繁體中文)',
      files: [],
      readme: 'THIS IS README',
      is_comprehensive_view: false,
    });

    return this.requestLLM(result);
  }

  public async createWikiArticle(): Promise<string> {
    const result = this.environment.render('stage-2.md', {
      repo_type: 'github',
      repo_url: 'https://github.com/FlySkyPie/ariadne-gis',
      repo_name: 'ariadne-gis',
      language_name: 'Traditional Chinese (繁體中文)',
      files: [],
      file_paths: [],
      title: '專案介紹',
    });

    return this.requestLLM(result);
  }

  private async requestLLM(content: string): Promise<string> {
    const model = this.configService.get<string>('openai.common_llm.model')!;
    const baseURL = this.configService.get<string>(
      'openai.common_llm.api_base',
    )!;
    const apiKey = this.configService.get<string>('openai.common_llm.api_key')!;
    const request: ChatCompletionCreateParamsBase = {
      model,
      messages: [
        {
          role: 'user',
          content,
        },
      ],
    };
    const response = await this.httpService.axiosRef.post<ChatCompletion>(
      `${baseURL}/chat/completions`,
      request,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      },
    );

    const result = response.data.choices[0].message.content;
    if (!result) {
      throw new Error('Got null response message');
    }

    return result;
  }
}
