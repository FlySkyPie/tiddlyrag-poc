import { Injectable } from '@nestjs/common';
import { InjectKysely } from 'nestjs-kysely';
import { Kysely } from 'kysely';
import { l2Distance } from 'pgvector/kysely';

import type { Database } from '../database/interfaces/database';
import { TiddlywikisService } from '../tiddywiki/tiddywiki.service';

import { WikiSummaryDto } from './dto/wiki-summary.dto';

@Injectable()
export class WikisService {
  constructor(
    @InjectKysely()
    private readonly db: Kysely<Database>,
    private readonly tiddlywikisService: TiddlywikisService,
  ) {}

  async findOne(wikiId: string): Promise<WikiSummaryDto> {
    const results = await this.db
      .selectFrom('wiki')
      .leftJoin('tiddler', 'tiddler.wikiUid', 'wiki.uid')
      .select(({ fn }) => [
        'wiki.id',
        'wiki.title',
        'wiki.subtitle',
        'wiki.description',
        fn.count('tiddler.id').as('tiddlerCount'),
      ])
      .groupBy(['wiki.id', 'wiki.title', 'wiki.subtitle', 'wiki.description'])
      .where('wiki.id', '=', wikiId)
      .executeTakeFirst();

    if (!results) {
      throw new Error(`The Wiki not found: ${wikiId}`);
    }

    return {
      ...results,
      tiddlerCount: Number(results.tiddlerCount),
    };
  }

  async findAll(): Promise<WikiSummaryDto[]> {
    const results = await this.db
      .selectFrom('wiki')
      .leftJoin('tiddler', 'tiddler.wikiUid', 'wiki.uid')
      .select(({ fn }) => [
        'wiki.id',
        'wiki.title',
        'wiki.subtitle',
        'wiki.description',
        fn.count('tiddler.id').as('tiddlerCount'),
      ])
      .groupBy(['wiki.id', 'wiki.title', 'wiki.subtitle', 'wiki.description'])
      .execute();

    return results.map((row) => ({
      ...row,
      tiddlerCount: Number(row.tiddlerCount),
    }));
  }

  async remove(widiId: string): Promise<void> {
    await this.db
      .deleteFrom('wiki')
      .where('wiki.id', '=', widiId)
      .executeTakeFirst();
  }

  async genTiddlyWiki(wikiId: string): Promise<string> {
    const wiki = await this.db
      .selectFrom('wiki')
      .select(['uid', 'title', 'subtitle'])
      .where('id', '=', wikiId)
      .executeTakeFirst();

    if (!wiki) {
      throw new Error(`The Wiki not found: ${wikiId}`);
    }

    const $tw = this.tiddlywikisService.loadTemplate();

    $tw.wiki.addTiddler(
      new $tw.Tiddler({ text: wiki.title }, { title: '$:/SiteTitle' }),
    );
    $tw.wiki.addTiddler(
      new $tw.Tiddler({ text: wiki.subtitle }, { title: '$:/SiteSubtitle' }),
    );

    const tiddlers = await this.db
      .selectFrom('tiddler')
      .select(['text', 'text', 'tags', 'meta', 'type', 'title'])
      .where('wikiUid', '=', wiki.uid)
      .execute();

    tiddlers.forEach((tiddler) => {
      $tw.wiki.addTiddler(
        new $tw.Tiddler(
          {
            text: tiddler.text,
            type: tiddler.type,
            tags: tiddler.tags,
            ...tiddler.meta,
          },
          { title: tiddler.title },
        ),
      );
    });

    const html: string = $tw.wiki.renderTiddler(
      'text/plain',
      '$:/core/save/all',
    );
    return html;
  }

  async queryByVector(
    embeddingVec: number[],
    limit: number = 5,
  ): Promise<WikiSummaryDto[]> {
    const subquery = this.db
      .selectFrom('wiki')
      .select(['id', 'uid', 'title', 'subtitle', 'description'])
      .orderBy(l2Distance('wiki.embedding', embeddingVec))
      .limit(limit);

    const results = await this.db
      .selectFrom(subquery.as('w'))
      .leftJoin('tiddler', 'tiddler.wikiUid', 'w.uid')
      .select(({ fn }) => [
        'w.id',
        'w.title',
        'w.subtitle',
        'w.description',
        fn.count('tiddler.id').as('tiddlerCount'),
      ])
      .groupBy(['w.id', 'w.title', 'w.subtitle', 'w.description'])
      .execute();

    return results.map((row) => ({
      ...row,
      tiddlerCount: Number(row.tiddlerCount),
    }));
  }
}
