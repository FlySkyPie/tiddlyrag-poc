import { ApiProperty } from '@nestjs/swagger';

export class TiddlerResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the Tiddler',
    format: 'integer',
  })
  id: number;

  @ApiProperty({
    description: 'Title of the Tiddler, unique within a Wiki',
    format: 'string',
  })
  title: string;

  @ApiProperty({
    description: 'Content of the Tiddler',
    format: 'string',
  })
  text: string;

  @ApiProperty({
    description: 'Type of the Tiddler',
    format: 'string',
    required: false,
    nullable: true,
  })
  type?: string | null;

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

  @ApiProperty({
    description: 'Wiki ID that this Tiddler belongs to',
    format: 'string',
  })
  wikiId: string;
}
