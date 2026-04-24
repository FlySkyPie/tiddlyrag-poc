import type { Repository } from 'typeorm';
import { Injectable, Inject } from '@nestjs/common';
import { InjectKysely } from 'nestjs-kysely';
import { Kysely } from 'kysely';
import { l2Distance } from 'pgvector/kysely';

import type { Database } from '../database/interfaces/database';
import { TiddlersService } from '../tiddlers/tiddlers.service';
import { TiddlywikisService } from '../tiddywiki/tiddywiki.service';
import { LlmService } from '../llm/llm.service';

import { Wiki } from './wiki.entity';
import { WikiSummaryDto } from './dto/wiki-summary.dto';

@Injectable()
export class WikisService {
  constructor(
    @Inject('WIKI_REPOSITORY')
    private wikiRepository: Repository<Wiki>,
    @InjectKysely()
    private readonly db: Kysely<Database>,
    private readonly tiddlywikisService: TiddlywikisService,
    private readonly tiddlersService: TiddlersService,
    private readonly llmService: LlmService,
  ) {}

  async create(wiki: Partial<Wiki>): Promise<Wiki> {
    return this.wikiRepository.save(wiki);
  }

  async createFromTiddyWiki(
    widiId: string,
    tiddlywikiHtml: string,
  ): Promise<Wiki> {
    const knowledge = this.tiddlywikisService.resolveTiddlyWiki(tiddlywikiHtml);

    // Create and save wiki first
    const createdWiki = await this.create({
      id: widiId,
      title: knowledge.title,
      subtitle: knowledge.subtitle,
      description: `Wiki for ${knowledge.title}`,
      embedding: [0], // placeholder
    });

    // Save tiddlers
    await this.tiddlersService.createMany(createdWiki, knowledge.tiddlers);

    const loadedWiki = await this.wikiRepository.findOne({
      where: { id: createdWiki.id },
      relations: {
        tiddlers: true,
      },
    });

    if (!loadedWiki) {
      throw new Error();
    }

    const [description, embedding] =
      await this.llmService.summarizeWiki(loadedWiki);

    loadedWiki.description = description;
    loadedWiki.embedding = embedding;

    await this.wikiRepository.save(loadedWiki);

    return loadedWiki;
  }

  async findOne(wikiId: string): Promise<Wiki | null> {
    return this.wikiRepository.findOne({
      where: { id: wikiId },
    });
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

  async findTiddlyWiki(wikiId: string): Promise<string> {
    const wiki = await this.wikiRepository.findOne({
      relations: {
        tiddlers: true,
      },
      where: {
        id: wikiId,
      },
    });

    if (!wiki) {
      throw new Error(`The wiki not found: ${wikiId}`);
    }

    const $tw = this.tiddlywikisService.loadTemplate();

    $tw.wiki.addTiddler(
      new $tw.Tiddler({ text: wiki.title }, { title: '$:/SiteTitle' }),
    );
    $tw.wiki.addTiddler(
      new $tw.Tiddler({ text: wiki.subtitle }, { title: '$:/SiteSubtitle' }),
    );
    wiki.tiddlers.forEach((tiddler) => {
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
