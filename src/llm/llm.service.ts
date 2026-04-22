import type {
  ChatCompletion,
  ChatCompletionCreateParamsBase,
} from 'openai/resources/chat/completions';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LlmService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async summarize(content: string): Promise<string> {
    const model = this.configService.get<string>('common_llm.embedding.model')!;
    const baseURL = this.configService.get<string>(
      'common_llm.embedding.api_base',
    )!;
    const apiKey = this.configService.get<string>(
      'common_llm.embedding.api_key',
    )!;
    const request: ChatCompletionCreateParamsBase = {
      model,
      messages: [
        {
          role: 'system',
          content: '',
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
