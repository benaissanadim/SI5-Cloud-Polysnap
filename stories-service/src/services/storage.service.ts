import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { FileNotFoundException } from '../exceptions/file-not-found.exception';
import { UsersProxyService } from './users-service-proxy/user-service-proxy.service';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly storage;

  constructor(private readonly usersProxyService: UsersProxyService) {
    this.storage = new Storage();
  }
  async generate(fileName: string, filetype: string): Promise<string> {
    try {
      const options = {
        version: 'v4' as const,
        action: 'write' as const,
        expires: Date.now() + 15 * 60 * 1000,
        contentType: filetype,
      };
      const [url] = await this.storage
        .bucket(process.env.BUCKET_NAME)
        .file(fileName)
        .getSignedUrl(options);
      this.logger.log('URL de téléversement signée PUT générée :');
      this.logger.log(url);
      this.logger.log(
        "Vous pouvez utiliser cette URL avec n'importe quel agent utilisateur, par exemple :",
      );
      this.logger.log(
        "curl -X PUT -H 'Content-Type: application/octet-stream' " +
          `--upload-file mon-fichier '${url}'`,
      );
      return url;
    } catch (error) {
      throw error;
    }
  }
  async download(
    fileName: string,
    viewerId: number,
    publisherId: number,
  ): Promise<string> {
    if (typeof viewerId !== 'number') {
      viewerId = parseInt(viewerId as string);
    }
    if (typeof publisherId !== 'number') {
      publisherId = parseInt(publisherId as string);
    }

    this.logger.log(
      `Downloading story for user ${viewerId} from user ${publisherId}`,
    );
    const contacts = await this.usersProxyService.getContactOfUser(publisherId);
    this.logger.log(`Retrieved contacts for user ${publisherId}:`, contacts);
    this.logger.log(
      `Checking if user ${viewerId} is authorized to access file`,
    );
    if (
      !contacts.some((contact) => contact.contactId === viewerId) &&
      publisherId !== viewerId
    ) {
      throw new UnauthorizedException(
        `The user ${viewerId} is not authorized to access the file ${fileName}.`,
      );
    }
    const file = this.storage.bucket(process.env.BUCKET_NAME).file(fileName);
    const [exists] = await file.exists();
    if (!exists) {
      throw new FileNotFoundException(`Le fichier ${fileName} n'existe pas.`);
    }
    return `https://storage.googleapis.com/${process.env.BUCKET_NAME}/${fileName}`;
  }
  async delete(fileName: string): Promise<void> {
    try {
      const file = this.storage.bucket(process.env.BUCKET_NAME).file(fileName);
      await file.delete();
      this.logger.log(`Deleted file: ${fileName}`);
    } catch (error) {
      this.logger.error(
        `Error deleting file ${fileName}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async verifyStoryExists(fileName: string): Promise<boolean> {
    this.logger.log(`Verify if ${fileName} exists`);

    return await this.storage
      .bucket(process.env.BUCKET_NAME)
      .file(fileName)
      .exists();
  }
}
