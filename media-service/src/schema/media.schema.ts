import {
  ImageExtension,
  VideoExtension,
  AudioExtension,
  FileType,
} from 'src/dtos/types';

export class MediaMetaData {
  filename: string;

  filetype: FileType;

  expirationdate: Date;

  uploaderId: string;

  extension: ImageExtension | VideoExtension | AudioExtension;
}
