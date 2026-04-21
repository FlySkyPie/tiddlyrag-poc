import { ApiProperty } from '@nestjs/swagger';

export class ResolveWikiParamsDto {
  @ApiProperty({
    description:
      'The question or task you need help with. Used to rank wiki results by relevance to the domain knowledge required.',
    format: 'string',
  })
  query: string;

  @ApiProperty({
    description: 'The name of the wiki or domain knowledge base to search for.',
    format: 'string',
  })
  wikiName: string;
}
