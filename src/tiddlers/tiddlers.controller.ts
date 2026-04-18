import { Controller, Get } from '@nestjs/common';
import { TiddlersService } from './tiddlers.service';

@Controller('wikis/:wiki/tiddlers')
export class TiddlersController {
  constructor(private readonly appService: TiddlersService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
