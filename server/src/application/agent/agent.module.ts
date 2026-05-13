import { Module } from '@nestjs/common';

import { GiteaModule } from '../gitea/gitea.module';

import { AgentGateway } from './agent.gateway';

@Module({
  imports: [GiteaModule],
  providers: [AgentGateway],
})
export class AgentModule {}
