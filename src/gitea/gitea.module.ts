import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { GiteaRepository } from './gitea.repository';

@Module({
  imports: [HttpModule],
  providers: [GiteaRepository],
  exports: [GiteaRepository],
})
export class GiteaModule {}
