/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { ITiddlyWiki } from 'tiddlywiki';
import { Injectable } from '@nestjs/common';
import { TiddlyWiki } from 'tiddlywiki';

import type { TiddywikiKnowledge } from './interfaces/tiddywiki-knowledge.dto';
import type { Tiddler } from './interfaces/tiddler.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TiddlywikisService {
  constructor(private readonly configService: ConfigService) {}

  public resolveTiddlyWiki(tiddlyHtml: string): TiddywikiKnowledge {
    const $tw = TiddlyWiki();

    // Set array to fix runtime error, set `version` to prevent print help info
    $tw.boot.argv = ['version'];
    $tw.boot.boot();

    const tiddlers = $tw.wiki
      .deserializeTiddlers('text/html', tiddlyHtml, {})
      .map<Tiddler>((item) => {
        let _tags: string[] = [];
        if (typeof item.tags === 'string') {
          _tags = $tw.utils.parseStringArray(item.tags);
        }

        const title: string = String(item.title);
        const text: string = String(item.text);

        return {
          ...item,
          title,
          text,
          tags: _tags,
        } as Tiddler;
      });

    const titleTiddler = tiddlers.find((item) => item.title === '$:/SiteTitle');
    if (!titleTiddler) {
      throw new Error("Invalid TiddyWiki file, '$:/SiteTitle'' is messing");
    }

    const subtitleTiddler = tiddlers.find(
      (item) => item.title === '$:/SiteSubtitle',
    );
    if (!subtitleTiddler) {
      throw new Error("Invalid TiddyWiki file, '$:/SiteSubtitle'' is messing");
    }

    const knowledgeTiddlers = tiddlers.filter(
      ({ tags }) => tags.includes('knowledge') as boolean,
    );

    return {
      title: titleTiddler.text,
      subtitle: subtitleTiddler.text,
      tiddlers: knowledgeTiddlers,
    };
  }

  public loadTemplate(): ITiddlyWiki {
    return this.loadWiki(
      this.configService.get<string>('tiddlywiki.template')!,
    );
  }

  /**
   * The TiddlyWiki template should be a folder containing following elements:
   * ```
   * ├── plugins
   * ├── tiddlers
   * └── tiddlywiki.info
   * ```
   */
  public loadWiki(wikiPath: string): ITiddlyWiki {
    const $tw = TiddlyWiki();

    // Set array to fix runtime error, set `version` to prevent print help info
    $tw.boot.argv = ['version'];
    $tw.boot.boot();

    $tw.loadWikiTiddlers(wikiPath);

    return $tw as ITiddlyWiki;
  }
}
