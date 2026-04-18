import 'multer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWikiDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
  })
  tiddlywiki: Express.Multer.File;
}
