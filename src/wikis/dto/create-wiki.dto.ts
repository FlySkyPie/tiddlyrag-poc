import 'multer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWikiDto {
  @ApiProperty({
    description: 'Specify uniq id for the wiki in Kebab case',
    format: 'string',
  })
  id: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
  })
  tiddlywiki: Express.Multer.File;
}
