import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Patch,
  NotFoundException,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

import { TiddlersService } from './tiddlers.service';
import { CreateTiddlerDto } from './dto/create-tiddler';
import { PatchTiddlerDto } from './dto/patch-tiddler.dto';
import { TiddlerResponseDto } from './dto/tiddler-response.dto';
import { TiddlerListResponseDto } from './dto/tiddler-list-response.dto';

@Controller('wikis/:wiki/tiddlers')
export class TiddlersController {
  constructor(private readonly tiddlersService: TiddlersService) {}

  @Get()
  async getTiddlers(
    @Param('wiki') wikiId: string,
  ): Promise<TiddlerListResponseDto> {
    const tiddlers = await this.tiddlersService.findAll(wikiId);
    if (!tiddlers) {
      throw new NotFoundException(`The Wiki is not found: ${wikiId}`);
    }

    return {
      tiddlers,
      total: tiddlers.length,
    };
  }

  @Post()
  async createTiddler(
    @Param('wiki') wikiId: string,
    @Body() createTiddlerDto: CreateTiddlerDto,
  ): Promise<TiddlerResponseDto> {
    return this.tiddlersService.simpleCreate(wikiId, createTiddlerDto);
  }

  @Get(':tiddler_id')
  async getTiddler(
    @Param('wiki') wikiId: string,
    @Param('tiddler_id') tiddlerId: number,
  ): Promise<TiddlerResponseDto> {
    const tiddler = await this.tiddlersService.findOne(wikiId, tiddlerId);
    if (!tiddler) {
      throw new NotFoundException();
    }

    return tiddler;
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
  @ApiOperation({
    summary: 'Delete a Tiddler.',
  })
  async deleteTiddler(
    @Param('wiki') wikiId: string,
    @Param('tiddler_id') tiddlerId: number,
  ): Promise<void> {
    await this.tiddlersService.delete(wikiId, tiddlerId);
  }
}
