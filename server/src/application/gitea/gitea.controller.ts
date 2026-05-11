import { Controller, Get, Param } from '@nestjs/common';

import { GiteaRepository } from './gitea.repository';

/**
 * Endpoints used for debugging and test.
 */
@Controller('gitea')
export class GiteaController {
  constructor(private readonly giteaRepository: GiteaRepository) {}

  @Get(':repo')
  async readAll(@Param('repo') repoId: string) {
    return this.giteaRepository.readFilePaths(repoId, undefined, [
      'package-lock.json',
    ]);
  }

  @Get(':repo/:path')
  async readFile(@Param('repo') repoId: string, @Param('path') path: string) {
    return this.giteaRepository.readFile(repoId, path);
  }
}
