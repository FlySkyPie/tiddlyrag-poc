import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import giteaConfig from './config/gitea';
import openaiConfig from './config/openai';
import { GiteaModule } from './gitea/gitea.module';

@Module({
  imports: [
    GiteaModule,
    ConfigModule.forRoot({
      load: [giteaConfig, openaiConfig],
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
