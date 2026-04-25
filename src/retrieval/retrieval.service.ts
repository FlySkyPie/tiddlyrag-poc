import { Injectable } from '@nestjs/common';

import { EmbeddingService } from '../embedding/embedding.service';
import { TiddlersService } from '../tiddlers/tiddlers.service';
import { WikisService } from '../wikis/wikis.service';

import { QueryTiddlersResponseItemDto } from './dto/query-tiddlers-response-item.dto';
import { ResolveWikiResponseItemDto } from './dto/resolve-wiki-response-item.dto';

@Injectable()
export class RetrievalService {
  constructor(
    private readonly wikisService: WikisService,
    private readonly embeddingService: EmbeddingService,
    private readonly tiddlersService: TiddlersService,
  ) {}

  async resolveWiki(query: string): Promise<ResolveWikiResponseItemDto[]> {
    const embeddingVec = await this.embeddingService.embedding(query);
    const result = await this.wikisService.queryByVector(embeddingVec);

    return result.map<ResolveWikiResponseItemDto>(
      ({ title, id, tiddlerCount }) => ({
        title,
        wikiId: id,
        tiddlerCount,
        score: 100, // fake data
      }),
    );
  }

  async queryTiddlers(
    wikiId: string,
    query: string,
  ): Promise<QueryTiddlersResponseItemDto[]> {
    const embeddingVec = await this.embeddingService.embedding(query);
    const tiddlers = await this.tiddlersService.queryByVector(
      wikiId,
      embeddingVec,
    );
    if (!tiddlers) {
      return [];
    }

    return tiddlers;
  }
}
