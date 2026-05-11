import type {
  CreateEmbeddingResponse,
  EmbeddingCreateParams,
} from 'openai/resources';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmbeddingService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async embedding(input: string): Promise<number[]> {
    const model = this.configService.get<string>('openai.embedding.model')!;
    const baseURL = this.configService.get<string>(
      'openai.embedding.api_base',
    )!;
    const apiKey = this.configService.get<string>('openai.embedding.api_key')!;
    const request: EmbeddingCreateParams = {
      input,
      model,
    };
    const response =
      await this.httpService.axiosRef.post<CreateEmbeddingResponse>(
        baseURL,
        request,
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        },
      );

    return response.data.data[0].embedding;
  }
}
