import { ApiProperty } from '@nestjs/swagger';

export class ResolveWikiResponseItemDto {
  @ApiProperty({
    format: 'string',
  })
  title: string;

  @ApiProperty({
    description: 'TiddlyRAG-compatible wiki ID',
    format: 'string',
  })
  wikiId: string;

  @ApiProperty({
    format: 'string',
  })
  description: string;

  @ApiProperty({
    format: 'number',
  })
  tiddlerCount: number;

  @ApiProperty({
    format: 'number',
  })
  score: number;
}
