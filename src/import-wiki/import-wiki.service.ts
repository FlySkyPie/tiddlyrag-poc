import { Injectable } from '@nestjs/common';
import { InjectKysely } from 'nestjs-kysely';
import { Kysely } from 'kysely';

import type { Database } from '../database/interfaces/database';
import { TiddlersService } from '../tiddlers/tiddlers.service';
import { TiddlywikisService } from '../tiddywiki/tiddywiki.service';
import { LlmService } from '../llm/llm.service';
import { EmbeddingService } from '../embedding/embedding.service';

@Injectable()
export class ImportWikiService {
  constructor(
    @InjectKysely()
    private readonly db: Kysely<Database>,
    private readonly tiddlywikisService: TiddlywikisService,
    private readonly tiddlersService: TiddlersService,
    private readonly llmService: LlmService,
    private readonly embeddingService: EmbeddingService,
  ) {}
}
