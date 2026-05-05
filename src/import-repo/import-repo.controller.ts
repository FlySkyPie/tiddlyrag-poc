import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';

import { GiteaRepository } from '../gitea/gitea.repository';

import { ImportRepoRequestDto } from './dto/import-repo-request.dto';
import { ImportRepoService } from './import-repo.service';

@Controller('import-repo')
export class ImportRepoController {
  constructor(
    private readonly giteaRepository: GiteaRepository,
    private readonly importRepoService: ImportRepoService,
  ) {}

  @Post('import')
  @ApiOperation({
    summary: 'Import Git repository.',
  })
  @ApiBody({
    type: ImportRepoRequestDto,
  })
  async import(@Body() importRepoRequestDto: ImportRepoRequestDto) {
    const { repoUrl, repoName } = importRepoRequestDto;
    return this.importRepoService.saimpleImport(repoUrl, repoName);
  }

  @Get('test')
  async test() {
    // return this.giteaRepository.readFile('AdalFlow', 'LICENSE.md');
    return this.giteaRepository.readFilePaths('AdalFlow');
  }
}
