import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Patch,
} from '@nestjs/common';

import { TiddlersService } from './tiddlers.service';
import { CreateTiddlerDto } from './dto/create-tiddler';
import { PatchTiddlerDto } from './dto/patch-tiddler.dto';
import { TiddlerResponseDto } from './dto/tiddler-response.dto';
import { TiddlerListResponseDto } from './dto/tiddler-list-response.dto';

@Controller('wikis/:wiki/tiddlers')
export class TiddlersController {
  constructor(private readonly tiddlersService: TiddlersService) {}

  /**
   * Only this endpoint is useful for POC, rest just for RESTful compatible.
   */
  @Get()
  async getTiddlers(
    @Param('wiki') wikiId: string,
  ): Promise<TiddlerListResponseDto> {
    throw new Error('Not implement yet');
  }

  @Post()
  async createTiddler(
    @Param('wiki') wikiId: string,
    @Body() createTiddlerDto: CreateTiddlerDto,
  ): Promise<TiddlerResponseDto> {
    throw new Error('Not implement yet');
  }

  @Get(':tiddler_id')
  async getTiddler(
    @Param('wiki') wikiId: string,
    @Param('tiddler_id') tiddlerId: number,
  ): Promise<TiddlerResponseDto> {
    throw new Error('Not implement yet');
  }

  @Patch(':tiddler_id')
  async patchTiddler(
    @Param('wiki') wikiId: string,
    @Param('tiddler_id') tiddlerId: number,
    @Body() updateTiddlerDto: PatchTiddlerDto,
  ): Promise<TiddlerResponseDto> {
    throw new Error('Not implement yet');
  }

  @Delete(':tiddler_id')
  async deleteTiddler(
    @Param('wiki') wikiId: string,
    @Param('tiddler_id') tiddlerId: number,
  ): Promise<void> {
    throw new Error('Not implement yet');
  }
}
