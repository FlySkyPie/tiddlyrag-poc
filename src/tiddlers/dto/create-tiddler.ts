import { ApiProperty } from '@nestjs/swagger';

export class CreateTiddlerDto {
  @ApiProperty({
    description: 'Title of the Tiddler, it should also be uniq in a Wiki.',
    type: 'string',
  })
  title: string;

  @ApiProperty({
    description: 'Content of the Tiddler.',
    type: 'string',
  })
  text: string;

  @ApiProperty({
    type: 'string',
    required: false,
  })
  type?: string;

  @ApiProperty({
    type: 'string',
    required: false,
    isArray: true,
  })
  tags?: string[];

  @ApiProperty({
    type: 'object',
    additionalProperties: { type: 'string' },
  })
  meta?: Record<string, unknown>;
}
