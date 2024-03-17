import { MediaMetaDataExistsDto } from 'src/dtos/types';

export interface IMediaService {
  getSignedUrlResponse(mediaMetaData: MediaMetaDataExistsDto): Promise<string>;

  verifyMediaExists(mediaMetaData: MediaMetaDataExistsDto): Promise<boolean>;
}