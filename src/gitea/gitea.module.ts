import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { GiteaRepository } from './gitea.repository';
import { GiteaController } from './gitea.controller';

@Module({
  imports: [HttpModule],
  controllers: [GiteaController],
  providers: [GiteaRepository],
  exports: [GiteaRepository],
})
export class GiteaModule {}
