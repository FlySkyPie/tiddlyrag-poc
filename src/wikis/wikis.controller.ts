import { Controller, Get } from '@nestjs/common';
import { WikisService } from './wikis.service';

@Controller()
export class WikisController {
  constructor(private readonly appService: WikisService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
