import { DataSource } from 'typeorm';

import { Tiddler } from './tiddler.entity';

export const tiddlerProviders = [
  {
    provide: 'TIDDLER_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Tiddler),
    inject: ['DATA_SOURCE'],
  },
];
