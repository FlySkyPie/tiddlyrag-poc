import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { GiteaRepository } from './gitea.repository';
import { GiteaController } from './gitea.controller';

@Module({
  imports: [HttpModule],
  providers: [GiteaRepository],
  controllers: [GiteaController],
})
export class GiteaModule {}
