import { FileTags, fileExtensions } from 'constants/files';

export const tagFileByExt = (fileName: string) => {
  const ext = fileName.split('.').pop();
  let result = FileTags.OTHER;

  for (let key in fileExtensions) {
    if (fileExtensions[key].includes(ext)) {
      result = FileTags[key.toUpperCase()];
    }
  }

  return result;
};
