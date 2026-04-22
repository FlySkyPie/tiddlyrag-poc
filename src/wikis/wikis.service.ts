import type { Repository } from 'typeorm';
import { Injectable, Inject } from '@nestjs/common';

import type { TiddlersService } from '../tiddlers/tiddlers.service';
import type { TiddlywikisService } from '../tiddywiki/tiddywiki.service';
import type { LlmService } from '../llm/llm.service';

import { Wiki } from './wiki.entity';

@Injectable()
export class WikisService {
  constructor(
    @Inject('WIKI_REPOSITORY')
    private wikiRepository: Repository<Wiki>,
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

  async findAll(): Promise<Wiki[]> {
    return this.wikiRepository.find();
  }

  async remove(widiId: string): Promise<void> {
    const wiki = await this.wikiRepository.findOne({
      where: { id: widiId },
    });
    if (!wiki) {
      throw new Error(`The wiki not found: ${widiId}`);
    }
    await this.wikiRepository.remove(wiki);
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
}
