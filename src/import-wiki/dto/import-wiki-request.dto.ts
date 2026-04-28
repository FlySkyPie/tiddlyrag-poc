import { ApiProperty } from '@nestjs/swagger';

export class ImportWikiRequestDto {
  @ApiProperty({
    description: 'Specify uniq id for the wiki in kebab-case.',
    format: 'string',
  })
  id: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'HTML file of TiddlyWiki.',
  })
  tiddlywiki: Express.Multer.File;
}
