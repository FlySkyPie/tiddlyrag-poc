import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';

import { ImportRepoRequestDto } from './dto/import-repo-request.dto';
import { GiteaRepository } from './gitea.repository';

@Controller('gitea')
export class GiteaController {
  constructor(private readonly giteaRepository: GiteaRepository) {}

  @Post('import')
  @ApiOperation({
    summary: 'Import Git repository.',
  })
  @ApiBody({
    type: ImportRepoRequestDto,
  })
  async import(@Body() importRepoRequestDto: ImportRepoRequestDto) {
    const { repoUrl, repoName } = importRepoRequestDto;
    return this.giteaRepository.migrate(repoUrl, repoName);
  }

  @Get('test')
  async test() {
    // return this.giteaRepository.readFile('AdalFlow', 'LICENSE.md');
    return this.giteaRepository.readFilePaths('AdalFlow');
  }
}
