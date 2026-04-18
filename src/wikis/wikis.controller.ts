import { Controller, Get, Post, Delete } from '@nestjs/common';
import { WikisService } from './wikis.service';

@Controller('wikis')
export class WikisController {
  constructor(private readonly appService: WikisService) {}

  @Post()
  createWiki(): string {
    throw new Error('Not implemented');
  }

  @Get()
  getWikis(): string {
    throw new Error('Not implemented');
  }

  @Delete()
  deleteWikis(): string {
    throw new Error('Not implemented');
  }
}
