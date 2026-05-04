import { ApiProperty } from '@nestjs/swagger';

export class ImportRepoRequestDto {
  @ApiProperty({
    description: 'Url of git repository.',
    format: 'string',
  })
  repoUrl: string;

  @ApiProperty({
    type: 'string',
    description: 'Name of repository after import.',
  })
  repoName: string;
}
