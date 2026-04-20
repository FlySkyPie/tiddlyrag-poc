import { Readable } from 'node:stream';
import {
  Controller,
  Get,
  Post,
  Delete,
  UseInterceptors,
  Body,
  UploadedFile,
  Param,
  StreamableFile,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiProduces } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

import type { Wiki } from './wiki.entity';
import { WikisService } from './wikis.service';
import { CreateWikiDto } from './dto/create-wiki.dto';

@Controller('wikis')
export class WikisController {
  constructor(private readonly wikisService: WikisService) {}

  @Post()
  @UseInterceptors(FileInterceptor('tiddlywiki'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'The HTML file of a Tiddlywiki.',
    type: CreateWikiDto,
    encoding: {
      tiddlywiki: {
        contentType: 'text/html',
      },
    },
  })
  async createWiki(
    @UploadedFile() tiddlywiki: Express.Multer.File,
    @Body() createWikiDto: CreateWikiDto,
  ) {
    return this.wikisService.createFromTiddyWiki(
      createWikiDto.id,
      tiddlywiki.buffer.toString(),
    );
  }

  @Get()
  async getWikis(): Promise<Wiki[]> {
    return this.wikisService.findAll();
  }

  @Get(':wiki')
  @ApiProduces('text/html')
  async getWiki(@Param('wiki') wikiId: string): Promise<StreamableFile> {
    const html = await this.wikisService.findTiddlyWiki(wikiId);
    return new StreamableFile(Readable.from(html), {
      type: 'text/html',
      disposition: `attachment; filename="${wikiId}.html"`,
    });
  }

  @Delete(':wiki')
  async deleteWiki(@Param('wiki') wikiId: string): Promise<void> {
    return this.wikisService.remove(wikiId);
  }
}
