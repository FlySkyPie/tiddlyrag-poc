import { Controller, Get, Post, Delete } from '@nestjs/common';

import { WikisService } from './wikis.service';
import type { Wiki } from './wiki.entity';

@Controller('wikis')
export class WikisController {
  constructor(private readonly wikisService: WikisService) {}

  @Post()
  createWiki(): string {
    throw new Error('Not implemented');
  }

  @Get()
  async getWikis(): Promise<Wiki[]> {
    return this.wikisService.findAll();
  }

  @Delete()
  deleteWikis(): string {
    throw new Error('Not implemented');
  }
}
