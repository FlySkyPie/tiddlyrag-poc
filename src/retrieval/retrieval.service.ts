import { Injectable } from '@nestjs/common';
import { l2Distance } from 'pgvector/kysely';
import { KyselyService } from '@anchan828/nest-kysely';

import { EmbeddingService } from '../embedding/embedding.service';
import { Database } from '../database/interfaces/database';

import { QueryTiddlersResponseItemDto } from './dto/query-tiddlers-response-item.dto';
import { ResolveWikiResponseItemDto } from './dto/resolve-wiki-response-item.dto';

@Injectable()
export class RetrievalService {
  constructor(
    private readonly embeddingService: EmbeddingService,
    private readonly kysely: KyselyService<Database>,
  ) {}

  async resolveWiki(query: string): Promise<ResolveWikiResponseItemDto[]> {
    const embeddingVec = await this.embeddingService.embedding(query);

    const subquery = this.kysely.db
      .selectFrom('wiki')
      .select(['id', 'uid', 'title', 'subtitle', 'description'])
      .orderBy(l2Distance('wiki.embedding', embeddingVec))
      .limit(5);

    const result = await this.kysely.db
      .selectFrom(subquery.as('w'))
      .leftJoin('tiddler', 'tiddler.wikiUid', 'w.uid')
      .select(({ fn }) => [
        'w.id as wikiId',
        'w.title',
        'w.description',
        fn.count('tiddler.id').as('tiddlerCount'),
      ])
      .groupBy(['w.id', 'w.title', 'w.subtitle', 'w.description'])
      .execute();

    return result.map<ResolveWikiResponseItemDto>(
      ({ tiddlerCount, ...rest }) => ({
        ...rest,
        tiddlerCount: Number(tiddlerCount),
        score: 100, // fake data
      }),
    );
  }

  async queryTiddlers(
    wikiId: string,
    query: string,
  ): Promise<QueryTiddlersResponseItemDto[]> {
    const embeddingVec = await this.embeddingService.embedding(query);
    const tiddlers = await this.kysely.db.transaction().execute(async (trx) => {
      const wiki = await trx
        .selectFrom('wiki')
        .select(['uid'])
        .where('id', '=', wikiId)
        .executeTakeFirst();
      if (!wiki) {
        return null;
      }

      const tiddlers = await this.kysely.db
        .selectFrom('tiddler')
        .select(['title', 'text'])
        .where('wikiUid', '=', wiki.uid)
        .orderBy(l2Distance('embedding', embeddingVec))
        .limit(5)
        .execute();

      return tiddlers.map((tiddler) => ({
        ...tiddler,
        wikiId,
      }));
    });
    if (!tiddlers) {
      return [];
    }

    return tiddlers;
  }
}
