import 'multer';
import { ApiProperty } from '@nestjs/swagger';

export class WikiSummaryDto {
  @ApiProperty({
    description: 'Uniq id for the wiki in kebab-case',
    format: 'string',
  })
  id: string;

  @ApiProperty({
    description: 'Title of the TiddlyWiki.',
    format: 'string',
  })
  title: string;

  @ApiProperty({
    description: 'Subtitle of the TiddlyWiki.',
    format: 'string',
  })
  subtitle: string;

  @ApiProperty({
    description: 'Abstract of the TiddlyWiki.',
    format: 'string',
  })
  description: string;

  @ApiProperty({
    description: 'Number of knowledge Tiddlers that TiddlyWiki containing.',
    format: 'string',
  })
  tiddlerCount: number;
}
