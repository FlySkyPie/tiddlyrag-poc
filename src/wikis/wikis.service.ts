import { Injectable } from '@nestjs/common';

@Injectable()
export class WikisService {
  getHello(): string {
    return 'Hello World!';
  }
}
