import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

import { ResolveWikiParamsDto } from './dto/resolve-wiki-params.dto';
import { QueryTiddlersParamsDto } from './dto/query-tiddlers-params.dto';
import { ResolveWikiResponseItemDto } from './dto/resolve-wiki-response-item.dto';
import { QueryTiddlersResponseItemDto } from './dto/query-tiddlers-response-item.dto';

@Controller('retrieval')
export class RetrievalController {
  constructor() {}

  @Post('wikis')
  @ApiOperation({
    summary:
      'Resolve knowledge domains to TiddlyRAG Wiki IDs for contextual querying',
    description:
      "Resolves a knowledge domain or project name to a TiddlyRAG-compatible Wiki ID and returns matching wikis.\n\nYou MUST call this function before 'Query Tiddlers' tool to obtain a valid Wiki ID UNLESS the user explicitly provides a Wiki ID in the format 'wiki-name' in their query.\n\nEach result includes:\n- Wiki ID: TiddlyRAG-compatible identifier (format: wiki-name)\n- Name: Wiki or Project name\n- Description: Short summary of the domain knowledge\n- Tiddler Count: Number of available information chunks (tiddlers)\n- Source Reputation: Trust indicator based on Zettelkasten principles (High, Medium, Low, or Unknown)\n- Domain Score: Quality indicator (100 is the highest score)\n\nSelection Process:\n1. Analyze the query to understand what knowledge domain the user is looking for\n2. Return the most relevant match based on:\n- Name similarity to the project/domain (exact matches prioritized)\n- Description relevance to the DDD (Domain-Driven Design) intent\n- Knowledge density (prioritize wikis with higher Tiddler counts)\n\nResponse Format:\n- Return the selected Wiki ID in a clearly marked section\n- Provide a brief explanation for why this wiki was chosen as the primary knowledge source\n\nIMPORTANT: Do not call this tool more than 3 times per question.",
  })
  @ApiOkResponse({
    type: ResolveWikiResponseItemDto,
    isArray: true,
  })
  async resolveWiki(
    @Body() resolveWikiParams: ResolveWikiParamsDto,
  ): Promise<ResolveWikiResponseItemDto[]> {
    throw new Error('Not implemented yet');
  }

  @Post('wikis/:wiki')
  @ApiOperation({
    summary: 'Search and retrieve relevant notes from a specific TiddlyWiki',
    description:
      "Retrieves and queries specific tiddlers (information chunks) from a TiddlyWiki knowledge base.\n\nYou must call 'Resolve TiddlyRAG Wiki ID' first to obtain the exact Wiki ID, UNLESS the user explicitly provides one in the format 'wiki-name'.\n\nThis tool performs semantic search across the non-linear notes (Zettelkasten) within the target wiki to find the most relevant context for the LLM.\n\nIMPORTANT: Do not call this tool more than 3 times per question. If you cannot find what you need after 3 calls, use the best information available in the retrieved tiddlers.",
  })
  @ApiOkResponse({
    type: QueryTiddlersResponseItemDto,
    isArray: true,
  })
  async quweryWiki(
    @Body() queryTiddlersParams: QueryTiddlersParamsDto,
  ): Promise<QueryTiddlersResponseItemDto[]> {
    throw new Error('Not implemented yet');
  }
}
