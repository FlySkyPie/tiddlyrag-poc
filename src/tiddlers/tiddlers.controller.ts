import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';

import { TiddlersService } from './tiddlers.service';
import { Tiddler } from './tiddler.entity';
import { CreateTiddlerDto } from './dto/create-tiddler';

@Controller('wikis/:wiki/tiddlers')
export class TiddlersController {
  constructor(private readonly tiddlersService: TiddlersService) {}

  @Post()
  async createTiddler(
    @Param('wiki') wikiId: string,
    @Body() createTiddlerDto: CreateTiddlerDto,
  ): Promise<any> {
    return this.tiddlersService.create(wikiId, createTiddlerDto);
  }

  @Get()
  async getTiddlers(@Param('wiki') wikiId: string): Promise<Tiddler[]> {
    return this.tiddlersService.findAll(wikiId);
  }

  @Get(':tiddler')
  async getTiddler(
    @Param('wiki') wikiId: string,
    @Param('tiddler') tiddlerTitle: string,
  ): Promise<Tiddler> {
    return this.tiddlersService.findOne(wikiId, tiddlerTitle);
  }

  @Put(':tiddler')
  async updateTiddler(
    @Param('wiki') wikiId: string,
    @Param('tiddler') tiddlerTitle: string,
    @Body() updateTiddlerDto: Partial<Tiddler>,
  ): Promise<Tiddler> {
    return this.tiddlersService.update(wikiId, tiddlerTitle, updateTiddlerDto);
  }

  @Delete(':tiddler')
  async deleteTiddler(
    @Param('wiki') wikiId: string,
    @Param('tiddler') tiddlerTitle: string,
  ): Promise<void> {
    return this.tiddlersService.delete(wikiId, tiddlerTitle);
  }
}
