import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';

import { GiteaRepository } from '../gitea/gitea.repository';
import { LlmService } from '../llm/llm.service';

import { ImportRepoRequestDto } from './dto/import-repo-request.dto';
import { ImportRepoService } from './import-repo.service';

@Controller('import-repo')
export class ImportRepoController {
  constructor(
    private readonly giteaRepository: GiteaRepository,
    private readonly importRepoService: ImportRepoService,
    private readonly llmService: LlmService,
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
    return this.importRepoService.simpleImport(repoUrl, repoName);
  }

  @Get('test')
  async test() {
    // return this.giteaRepository.readFile('AdalFlow', 'LICENSE.md');
    // return this.giteaRepository.readFilePaths('AdalFlow');
    // return this.llmService.createWikiStructure();
    return this.importRepoService.simpleCreateWiki('ariadne-gis');
  }
}
