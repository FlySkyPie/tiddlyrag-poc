import {
  Controller,
  Get,
  Post,
  Delete,
  UseInterceptors,
  Body,
  UploadedFile,
} from '@nestjs/common';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

import type { Wiki } from './wiki.entity';
import { WikisService } from './wikis.service';
import { CreateWikiDto } from './dto/create-wiki.dto';
import { TiddlywikisService } from './tiddywiki.service';

@Controller('wikis')
export class WikisController {
  constructor(
    private readonly wikisService: WikisService,
    private readonly tiddlywikisService: TiddlywikisService,
  ) {}

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
  async createWiki(@UploadedFile() tiddlywiki: Express.Multer.File) {
    const wiki = this.tiddlywikisService.resolveTiddlyWiki(
      tiddlywiki.buffer.toString(),
    );
    console.log(wiki);
    /**
     * @todo Store wiki into database
     */
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
