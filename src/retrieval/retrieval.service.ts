import { Injectable } from '@nestjs/common';
import { l2Distance } from 'pgvector/kysely';
import { Kysely } from 'kysely';
import { InjectKysely } from 'nestjs-kysely';

import { EmbeddingService } from '../embedding/embedding.service';
import { Database } from '../database/interfaces/database';

import { QueryTiddlersResponseItemDto } from './dto/query-tiddlers-response-item.dto';
import { ResolveWikiResponseItemDto } from './dto/resolve-wiki-response-item.dto';

@Injectable()
export class RetrievalService {
  constructor(
    private readonly embeddingService: EmbeddingService,
    @InjectKysely()
    private readonly db: Kysely<Database>,
  ) {}

  async resolveWiki(query: string): Promise<ResolveWikiResponseItemDto[]> {
    const embeddingVec = await this.embeddingService.embedding(query);

    const subquery = this.db
      .selectFrom('wiki')
      .select(['id', 'uid', 'title', 'subtitle', 'description'])
      .orderBy(l2Distance('wiki.embedding', embeddingVec))
      .limit(5);

    const result = await this.db
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
    const tiddlers = await this.db.transaction().execute(async (trx) => {
      const wiki = await trx
        .selectFrom('wiki')
        .select(['uid'])
        .where('id', '=', wikiId)
        .executeTakeFirst();
      if (!wiki) {
        return null;
      }

      const tiddlers = await this.db
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
