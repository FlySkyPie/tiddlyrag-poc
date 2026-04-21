import { ApiProperty } from '@nestjs/swagger';

export class QueryTiddlersResponseItemDto {
  @ApiProperty({
    format: 'string',
  })
  title: string;

  @ApiProperty({
    format: 'string',
  })
  text: string;
}
