import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';

import { Tiddler } from './tiddler.entity';

@Injectable()
export class TiddlersService {
  constructor(
    @Inject('TIDDLER_REPOSITORY')
    private tiddlerRepository: Repository<Tiddler>,
  ) {}

  async create(tiddlers: Partial<Tiddler>[]): Promise<Tiddler[]> {
    return this.tiddlerRepository.save(tiddlers);
  }
}
