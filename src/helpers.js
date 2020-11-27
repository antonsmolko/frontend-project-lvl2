import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

export const isObject = (item) => (
  item && typeof item === 'object' && !Array.isArray(item)
);

const getFullPath = (fileName) => {
  const fullPath = path.resolve(process.cwd(), fileName);

  return fullPath;
};

const getExtension = (filePath) => path.extname(filePath).substr(1);

const readFile = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf-8');

    return data;
  } catch (e) {
    console.log(`File '${filePath}' not found!`);
    throw new Error(e);
  }
};

export const getFileData = (fileName) => {
  const filePath = getFullPath(fileName);
  const extension = getExtension(filePath);
  const data = readFile(filePath);

  switch (extension) {
    case 'json':
      return JSON.parse(data);
    case 'yml':
      return yaml.safeLoad(data);
    default:
      console.log('Not valid file extension!');
      throw new Error(`File ${fileName} does not have a valid file extension!`);
  }
};

export default {
  isObject,
  getFileData,
};
