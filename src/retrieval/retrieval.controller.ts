import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

import { WikisService } from '../wikis/wikis.service';

import { ResolveWikiParamsDto } from './dto/resolve-wiki-params.dto';
import { QueryTiddlersParamsDto } from './dto/query-tiddlers-params.dto';
import { ResolveWikiResponseItemDto } from './dto/resolve-wiki-response-item.dto';
import { QueryTiddlersResponseItemDto } from './dto/query-tiddlers-response-item.dto';
import { RetrievalService } from './retrieval.service';

@Controller('retrieval')
export class RetrievalController {
  constructor(
    private readonly wikisService: WikisService,
    private readonly retrievalService: RetrievalService,
  ) {}

  @Post('wikis')
  @ApiOperation({
    summary:
      'Resolve knowledge domains to TiddlyRAG Wiki IDs for contextual querying',
    description: readFileSync(
      resolve(__dirname, './prompts/resolve-wikis-description.md'),
      'utf8',
    ),
  })
  @ApiOkResponse({
    type: ResolveWikiResponseItemDto,
    isArray: true,
  })
  async resolveWiki(
    @Body() resolveWikiParams: ResolveWikiParamsDto,
  ): Promise<ResolveWikiResponseItemDto[]> {
    const { query } = resolveWikiParams;
    return this.retrievalService.resolveWiki(query);
  }

  @Post('wikis/:wiki')
  @ApiOperation({
    summary: 'Search and retrieve relevant notes from a specific TiddlyWiki',
    description: readFileSync(
      resolve(__dirname, './prompts/query-tiddlers-description.md'),
      'utf8',
    ),
  })
  @ApiOkResponse({
    type: QueryTiddlersResponseItemDto,
    isArray: true,
  })
  async queryTiddlers(
    @Body() queryTiddlersParams: QueryTiddlersParamsDto,
  ): Promise<QueryTiddlersResponseItemDto[]> {
    const { wikiId, query } = queryTiddlersParams;
    const wiki = await this.wikisService.findOne(wikiId);
    if (!wiki) {
      throw new Error(`The wiki not found: ${wikiId}`);
    }

    return this.retrievalService.queryTiddlers(wikiId, query);
  }
}
