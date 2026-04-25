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
import {
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiProduces,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

import { ImportWikiService } from '../import-wiki/import-wiki.service';

import { WikisService } from './wikis.service';
import { CreateWikiDto } from './dto/create-wiki.dto';
import { WikiSummaryDto } from './dto/wiki-summary.dto';

@Controller('wikis')
export class WikisController {
  constructor(
    private readonly wikisService: WikisService,
    private readonly importWikiService: ImportWikiService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('tiddlywiki'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
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
    return this.importWikiService.simpleImportFromTiddyWiki(
      createWikiDto.id,
      tiddlywiki.buffer.toString(),
    );
  }

  @Get()
  @ApiOkResponse({
    description: 'List all Wikis.',
    type: WikiSummaryDto,
    isArray: true,
  })
  async getWikis(): Promise<WikiSummaryDto[]> {
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
