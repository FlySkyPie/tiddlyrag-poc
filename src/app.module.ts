import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { WikisModule } from './wikis/wikis.module';
import { TiddlersModule } from './tiddlers/tiddlers.module';
import { DatabaseModule } from './database/database.module';
import databaseConfig from './config/database';

@Module({
  imports: [
    WikisModule,
    TiddlersModule,
    DatabaseModule,
    ConfigModule.forRoot({
      load: [databaseConfig],
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
