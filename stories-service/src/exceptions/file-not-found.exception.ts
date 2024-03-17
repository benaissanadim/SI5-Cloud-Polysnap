import { HttpException } from '@nestjs/common';

export class FileNotFoundException extends HttpException {
  constructor(fileName: string) {
    super(`Le fichier ${fileName} n'a pas été trouvé.`, 404);
    this.name = 'FileNotFoundException';
  }
}
