import { ApiProperty } from '@nestjs/swagger';

import { TiddlerResponseDto } from './tiddler-response.dto';

export class TiddlerListResponseDto {
  @ApiProperty({
    description: 'List of Tiddlers in the Wiki',
    type: [TiddlerResponseDto],
  })
  tiddlers: TiddlerResponseDto[];

  @ApiProperty({
    description: 'Total number of Tiddlers in the Wiki',
    format: 'integer',
  })
  total: number;
}