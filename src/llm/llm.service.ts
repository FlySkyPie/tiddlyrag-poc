import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import type {
  ChatCompletion,
  ChatCompletionCreateParamsBase,
} from 'openai/resources/chat/completions';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Handlebars from 'handlebars';

import type { Wiki } from '../wikis/wiki.entity';
import { EmbeddingService } from '../embedding/embedding.service';

@Injectable()
export class LlmService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly embeddingService: EmbeddingService,
  ) {}

  public async summarizeWiki(
    wiki: Wiki,
  ): Promise<[abstract: string, embedding: number[]]> {
    const templateStr = await readFile(
      resolve(__dirname, './prompts/tiddlywiki-context-bundle.hbs'),
      'utf8',
    );
    const template = Handlebars.compile(templateStr);

    const abstract = await this.summarizeFromBundle(
      template({
        title: wiki.title,
        subtitle: wiki.subtitle,
        tiddlers: wiki.tiddlers,
      }),
    );

    const embedding = await this.embeddingService.embedding(abstract);

    return [abstract, embedding];
  }

  private async summarizeFromBundle(content: string): Promise<string> {
    const systemPrompts = await readFile(
      resolve(__dirname, './prompts/summarizer.md'),
      'utf8',
    );
    const model = this.configService.get<string>('openai.common_llm.model')!;
    const baseURL = this.configService.get<string>(
      'openai.common_llm.api_base',
    )!;
    const apiKey = this.configService.get<string>('openai.common_llm.api_key')!;
    const request: ChatCompletionCreateParamsBase = {
      model,
      messages: [
        {
          role: 'system',
          content: systemPrompts,
        },
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
