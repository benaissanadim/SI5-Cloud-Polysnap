import { IsNotEmpty } from 'class-validator';

export class MediaMetaDataDto {
  @IsNotEmpty()
  filename: string;

  @IsNotEmpty()
  filetype: FileType;

  expirationdate: Date;

  @IsNotEmpty()
  uploaderId: string;

  @IsNotEmpty()
  extension: ImageExtension | VideoExtension | AudioExtension;
}

export class MediaMetaDataExistsDto {
  @IsNotEmpty()
  filename: string;

  @IsNotEmpty()
  filetype: FileType;

  @IsNotEmpty()
  extension: ImageExtension | VideoExtension | AudioExtension;
}

export enum FileType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
}

export enum ImageExtension {
  JPG = 'jpg',
  JPEG = 'jpeg',
  PNG = 'png',
  GIF = 'gif',
  WEBP = 'webp',
  TIFF = 'tiff',
  RAW = 'raw',
  ICO = 'ico',
  PDF = 'pdf',
  EPS = 'eps',
  PSD = 'psd',
  SVG = 'svg',
}

export enum VideoExtension {
  mp4 = 'mp4',
  mov = 'mov',
  avi = 'avi',
  mkv = 'mkv',
  webm = 'webm',
  wmv = 'wmv',
  mpg = 'mpg',
  mpeg = 'mpeg',
  flv = 'flv',
  m4v = 'm4v',
  mts = 'mts',
  m2ts = 'm2ts',
  ts = 'ts',
  vob = 'vob',
  ogv = 'ogv',
}

export enum AudioExtension {
  mp3 = 'mp3',
  wav = 'wav',
  ogg = 'ogg',
  m4a = 'm4a',
  aac = 'aac',
  wma = 'wma',
  flac = 'flac',
  alac = 'alac',
  aiff = 'aiff',
  pcm = 'pcm',
}
