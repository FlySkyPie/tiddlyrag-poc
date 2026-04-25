import { Injectable } from '@nestjs/common';
import { InjectKysely } from 'nestjs-kysely';
import { Kysely } from 'kysely';

import type { Database } from '../database/interfaces/database';
import type { Wiki } from '../database/interfaces/wiki';
import { TiddlywikisService } from '../tiddywiki/tiddywiki.service';
import { LlmService } from '../llm/llm.service';
import { EmbeddingService } from '../embedding/embedding.service';

@Injectable()
export class ImportWikiService {
  constructor(
    @InjectKysely()
    private readonly db: Kysely<Database>,
    private readonly tiddlywikisService: TiddlywikisService,
    private readonly llmService: LlmService,
    private readonly embeddingService: EmbeddingService,
  ) {}

  /**
   * POC implementation. This method would blocked the eexecution until all task is done.
   * Not a production ready implementation but providing basic interface to import TiddlyWiki as test data.
   */
  async simpleImportFromTiddyWiki(
    widiId: string,
    tiddlywikiHtml: string,
  ): Promise<Omit<Wiki, 'embedding'>> {
    const { title, subtitle, tiddlers } =
      this.tiddlywikisService.resolveTiddlyWiki(tiddlywikiHtml);

    const createdWiki = await this.db
      .insertInto('wiki')
      .values([
        {
          id: widiId,
          title,
          subtitle,
          description: `Wiki for ${title}`,
          embedding: [0], // placeholder
        },
      ])
      .returning('uid')
      .executeTakeFirst();

    if (!createdWiki) {
      throw new Error('Unexpected state');
    }

    for (let index = 0; index < tiddlers.length; index++) {
      const { title, text, type, tags, ...rest } = tiddlers[index];
      const embedding = await this.embeddingService.embedding(text ?? '');

      await this.db
        .insertInto('tiddler')
        .values([
          {
            wikiUid: createdWiki.uid,
            title,
            text,
            meta: { ...rest },
            tags: tags ?? [],
            type,
            embedding,
          },
        ])
        .executeTakeFirst();
    }

    const description = await this.llmService.summarizeWiki(
      title,
      subtitle,
      tiddlers,
    );
    const embedding = await this.embeddingService.embedding(description);

    const result = await this.db
      .updateTable('wiki')
      .set({
        description,
        embedding,
      })
      .where('uid', '=', createdWiki.uid)
      .returning(['id', 'uid', 'title', 'subtitle', 'description'])
      .executeTakeFirst();

    if (!result) {
      throw new Error('Unexpected state');
    }

    return result;
  }
}
