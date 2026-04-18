import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';

import { Wiki } from './wiki.entity';
@Injectable()
export class WikisService {
  constructor(
    @Inject('WIKI_REPOSITORY')
    private wikiRepository: Repository<Wiki>,
  ) {}

  async findAll(): Promise<Wiki[]> {
    return this.wikiRepository.find();
  }
}
