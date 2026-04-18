import { Injectable } from '@nestjs/common';

@Injectable()
export class TiddlersService {
  getHello(): string {
    return 'Hello World!';
  }
}
