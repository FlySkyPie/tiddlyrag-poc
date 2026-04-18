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
import { TiddlersService } from '../tiddlers/tiddlers.service';

@Controller('wikis')
export class WikisController {
  constructor(
    private readonly wikisService: WikisService,
    private readonly tiddlywikisService: TiddlywikisService,
    private readonly tiddlersService: TiddlersService,
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
    const knowledge = this.tiddlywikisService.resolveTiddlyWiki(
      tiddlywiki.buffer.toString(),
    );

    // Generate wiki id from title
    const id = knowledge.title.toLowerCase().replace(/\s+/g, '-');

    // Create and save wiki first
    const savedWiki = await this.wikisService.create({
      id,
      title: knowledge.title,
      subtitle: knowledge.subtitle,
      description: `Wiki for ${knowledge.title}`,
    });

    // Prepare tiddlers with wiki reference
    const tiddlerData = knowledge.tiddlers.map((t) => ({
      title: t.title,
      text: t.text,
      type: t.type,
      tags: t.tags,
      meta: {
        created: t.created,
        modified: t.modified,
        revision: t.revision,
        bag: t.bag,
      },
      wiki: savedWiki,
    }));

    // Save tiddlers
    await this.tiddlersService.create(tiddlerData);

    return savedWiki;
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
