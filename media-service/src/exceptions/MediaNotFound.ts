import { HttpException, HttpStatus } from '@nestjs/common';

export class MediaNotFoundException extends HttpException {
  constructor() {
    super('Media not found', HttpStatus.NOT_FOUND);
  }
}
