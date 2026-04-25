import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody, ApiOperation } from '@nestjs/swagger';

import { CreateWikiDto } from './dto/create-wiki.dto';

@Controller('import-wiki')
export class ImportWikiController {
  @Post('tiddlywiki-html')
  @ApiOperation({
    summary: 'Import wiki from a TiddlyWiki HTML file.',
  })
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
  createWiki(
    @UploadedFile() tiddlywiki: Express.Multer.File,
    @Body() createWikiDto: CreateWikiDto,
  ) {
    /**
     * DO NOT implement this in POC.
     * The expected behavior (ideal) of this endpoint is queue the task into background,
     * and return a task id.
     * The cost of the implement the behavior is too hight, so DO NOT implement this is POC stage.
     */
    throw new Error('Not implement yet');
  }
}
