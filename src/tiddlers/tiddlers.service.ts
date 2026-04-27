import { Injectable, NotFoundException } from '@nestjs/common';
import { KyselyService } from '@anchan828/nest-kysely';

import { Database } from '../database/interfaces/database';

import { CreateTiddlerDto } from './dto/create-tiddler';
import { TiddlerResponseDto } from './dto/tiddler-response.dto';

@Injectable()
export class TiddlersService {
  constructor(private readonly kysely: KyselyService<Database>) {}

  /**
   * When a content of Wiki (Tidder) been update, embedding and abstract should also been update,
   * but this method is for POC, so the process is ignored for now.
   */
  async simpleCreate(
    wikiId: string,
    createTiddlerDto: CreateTiddlerDto,
  ): Promise<TiddlerResponseDto> {
    const wiki = await this.kysely.db
      .selectFrom('wiki')
      .select('uid')
      .where('id', '=', wikiId)
      .executeTakeFirst();

    if (!wiki) {
      throw new Error(`The Wiki not found: ${wikiId}`);
    }

    const { title, text, meta, tags, type } = createTiddlerDto;
    const tiddler = await this.kysely.db
      .insertInto('tiddler')
      .values([
        {
          wikiUid: wiki.uid,
          title,
          text,
          meta: { ...meta },
          tags: tags ?? [],
          type,
          embedding: [0], // placeholder
        },
      ])
      .returning(['id', 'title', 'text', 'meta', 'tags', 'type'])
      .executeTakeFirst();

    if (!tiddler) {
      throw new Error();
    }

    return {
      ...tiddler,
      wikiId,
    };
  }

  async findAll(wikiId: string): Promise<TiddlerResponseDto[] | null> {
    return await this.kysely.db.transaction().execute(async (trx) => {
      const wiki = await trx
        .selectFrom('wiki')
        .select(['uid'])
        .where('id', '=', wikiId)
        .executeTakeFirst();
      if (!wiki) {
        return null;
      }

      const tiddlers = await trx
        .selectFrom('tiddler')
        .select(['id', 'title', 'text', 'meta', 'tags', 'type'])
        .where('wikiUid', '=', wiki.uid)
        .execute();

      return tiddlers.map((tiddler) => ({
        ...tiddler,
        wikiId,
      }));
    });
  }

  async findOne(
    wikiId: string,
    tiddlerId: number,
  ): Promise<TiddlerResponseDto | null> {
    return await this.kysely.db.transaction().execute(async (trx) => {
      const wiki = await trx
        .selectFrom('wiki')
        .select(['uid'])
        .where('id', '=', wikiId)
        .executeTakeFirst();
      if (!wiki) {
        return null;
      }

      const tiddler = await trx
        .selectFrom('tiddler')
        .select(['id', 'title', 'text', 'meta', 'tags', 'type'])
        .where('id', '=', tiddlerId)
        .executeTakeFirst();

      if (!tiddler) {
        return null;
      }

      return {
        ...tiddler,
        wikiId,
      };
    });
  }

  async delete(wikiId: string, tiddlerId: number): Promise<void> {
    await this.kysely.db.transaction().execute(async (trx) => {
      const wiki = await trx
        .selectFrom('wiki')
        .select(['uid'])
        .where('id', '=', wikiId)
        .executeTakeFirst();
      if (!wiki) {
        throw new NotFoundException(`Wiki not found: ${wikiId}`);
      }

      await trx.deleteFrom('tiddler').where('id', '=', tiddlerId).execute();
    });
  }
}
