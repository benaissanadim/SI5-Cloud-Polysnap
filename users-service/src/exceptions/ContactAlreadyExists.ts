import { HttpException, HttpStatus } from '@nestjs/common';

export class ContactAlreadyExists extends HttpException {
  constructor() {
    super('Contact already exists', HttpStatus.CONFLICT);
  }
}
