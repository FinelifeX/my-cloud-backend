export enum FileTags {
  IMAGE = 'image',
  VIDEO = 'video',
  SOUND = 'sound',
  OTHER = 'other',
};

export const fileExtensions = {
  [FileTags.IMAGE]: ['jpg', 'png', 'tif', 'gif'],
  [FileTags.VIDEO]: ['mp4', 'avi', 'mov', 'webm', 'wmv'],
  [FileTags.SOUND]: ['mp3', 'acc', 'flac', 'ogg', 'wma'],
};