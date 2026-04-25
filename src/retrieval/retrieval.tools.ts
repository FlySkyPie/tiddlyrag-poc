import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { Injectable } from '@nestjs/common';
import { Tool } from '@rekog/mcp-nest';
import { z } from 'zod';
import Handlebars from 'handlebars';
import { readFile } from 'node:fs/promises';

import { WikisService } from '../wikis/wikis.service';

import { RetrievalService } from './retrieval.service';

import { ResolveWikiParamsDto } from './dto/resolve-wiki-params.dto';
import { QueryTiddlersParamsDto } from './dto/query-tiddlers-params.dto';

@Injectable()
export class RetrievalTools {
  constructor(
    private readonly wikisService: WikisService,
    private readonly retrievalService: RetrievalService,
  ) {}

  @Tool({
    name: 'resolve-wiki-id',
    description: readFileSync(
      resolve(__dirname, './prompts/resolve-wikis-description.md'),
      'utf8',
    ),
    parameters: z.object({
      query: z.string(),
    }),
  })
  async resolveWiki({ query }: ResolveWikiParamsDto): Promise<string> {
    const templateStr = await readFile(
      resolve(__dirname, './prompts/resolve-wikis-response.hbs'),
      'utf8',
    );

    const wikis = await this.retrievalService.resolveWiki(query);

    return Handlebars.compile(templateStr, { noEscape: true })({
      wikis,
    });
  }

  @Tool({
    name: 'query-tiddlers',
    description: readFileSync(
      resolve(__dirname, './prompts/query-tiddlers-description.md'),
      'utf8',
    ),
    parameters: z.object({
      wikiId: z.string(),
      query: z.string(),
    }),
  })
  async queryTiddlers({
    wikiId,
    query,
  }: QueryTiddlersParamsDto): Promise<string> {
    const wiki = await this.wikisService.findOne(wikiId);
    if (!wiki) {
      return `The wiki not found: ${wikiId}`;
    }

    const templateStr = await readFile(
      resolve(__dirname, './prompts/query-tiddlers-response.hbs'),
      'utf8',
    );

    const tiddlers = await this.retrievalService.queryTiddlers(wikiId, query);

    return Handlebars.compile(templateStr, { noEscape: true })({
      tiddlers,
    });
  }
}
