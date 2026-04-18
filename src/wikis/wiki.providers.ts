import { DataSource } from 'typeorm';

import { Wiki } from './wiki.entity';

export const wikiProviders = [
  {
    provide: 'WIKI_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Wiki),
    inject: ['DATA_SOURCE'],
  },
];
