import { Controller, Get, Post, Put, Delete, Param } from '@nestjs/common';
import { TiddlersService } from './tiddlers.service';

@Controller('wikis/:wiki/tiddlers')
export class TiddlersController {
  constructor(private readonly appService: TiddlersService) {}

  @Post()
  createTiddler(@Param('wiki') wiki: string): string {
    throw new Error('Not implemented');
  }

  @Get()
  getTiddlers(@Param('wiki') wiki: string): string {
    throw new Error('Not implemented');
  }

  @Get(':tiddler')
  getTiddler(
    @Param('wiki') wiki: string,
    @Param('tiddler') tiddler: string,
  ): string {
    throw new Error('Not implemented');
  }

  @Put(':tiddler')
  updateTiddler(
    @Param('wiki') wiki: string,
    @Param('tiddler') tiddler: string,
  ): string {
    throw new Error('Not implemented');
  }

  @Delete(':tiddler')
  deleteTiddler(
    @Param('wiki') wiki: string,
    @Param('tiddler') tiddler: string,
  ): string {
    throw new Error('Not implemented');
  }
}
