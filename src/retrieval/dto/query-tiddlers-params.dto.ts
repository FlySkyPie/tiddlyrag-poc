import { ApiProperty } from '@nestjs/swagger';

export class QueryTiddlersParamsDto {
  @ApiProperty({
    description:
      "Exact TiddlyRAG-compatible Wiki ID (e.g., 'tiddlyrag-planning') retrieved from 'resolve-wiki-id'.",
    format: 'string',
  })
  wikiId: string;

  @ApiProperty({
    description:
      "The specific question. Be precise to help the RAG system match the right tiddlers. Good: 'How to handle Git commit formats in TiddlyRAG' or 'Zettelkasten atomicity principle'. Bad: 'notes' or 'how to write'.",
    format: 'string',
  })
  query: string;
}
