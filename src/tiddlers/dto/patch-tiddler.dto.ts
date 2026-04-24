import { ApiProperty, PartialType } from '@nestjs/swagger';

import { CreateTiddlerDto } from './create-tiddler';

export class PatchTiddlerDto extends PartialType(CreateTiddlerDto) {
  @ApiProperty({
    description: 'Title of the Tiddler, unique within a Wiki',
    format: 'string',
    required: false,
  })
  title?: string;

  @ApiProperty({
    description: 'Content of the Tiddler',
    format: 'string',
    required: false,
  })
  text?: string;

  @ApiProperty({
    description: 'Type of the Tiddler',
    format: 'string',
    required: false,
    nullable: true,
  })
  type?: string;

  @ApiProperty({
    description: 'Tags associated with the Tiddler',
    format: 'string',
    isArray: true,
    required: false,
  })
  tags?: string[];

  @ApiProperty({
    description: 'Additional metadata for the Tiddler',
    format: 'object',
    required: false,
  })
  meta?: Record<string, unknown>;
}
