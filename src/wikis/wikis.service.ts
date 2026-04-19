/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { resolve } from 'node:path';
import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';

import { Wiki } from './wiki.entity';
import { TiddlywikisService } from './tiddywiki.service';
@Injectable()
export class WikisService {
  constructor(
    @Inject('WIKI_REPOSITORY')
    private wikiRepository: Repository<Wiki>,
    private readonly tiddlywikisService: TiddlywikisService,
    private readonly configService: ConfigService,
  ) {}

  async create(wiki: Partial<Wiki>): Promise<Wiki> {
    return this.wikiRepository.save(wiki);
  }

  async findAll(): Promise<Wiki[]> {
    return this.wikiRepository.find();
  }

  async findTiddlyWiki(widiId: string): Promise<string> {
    const wiki = await this.wikiRepository.findOne({
      relations: {
        tiddlers: true,
      },
      where: {
        id: widiId,
      },
    });

    if (!wiki) {
      throw new Error(`The wiki not found: ${widiId}`);
    }

    const $tw = this.tiddlywikisService.loadTemplate(
      this.configService.get<string>('tiddlywiki.template')!,
    );

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
