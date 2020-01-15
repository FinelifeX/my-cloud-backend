import { FileTags, fileExtensions } from "constants/files";

export const tagFileByExt = (fileName: string) => {
  const parts = fileName.split('.');
  const ext = parts[parts.length - 1];
  let result = FileTags.OTHER;

  for (let key in fileExtensions) {
    if (fileExtensions[key].includes(ext)) {
      result = FileTags[key.toUpperCase()];
    };
  };

  return result;
}