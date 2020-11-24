import path from 'path';
import parse from './parsers.js';
import formatters from './formatters/index.js';

/**
 * Returns absolute file path
 *
 * @param {string} filePath
 */
const getFullPath = (filePath) => {
  const fullPath = path.resolve(process.cwd(), filePath);

  return fullPath;
};

/**
 * Returns template of compared result two object of data
 */
export default (filename1, filename2, formatName = 'stylish') => {
  const path1 = getFullPath(filename1);
  const path2 = getFullPath(filename2);

  const parsedData = parse(path1, path2);
  const formatter = formatters(formatName);

  return formatter(parsedData);
};
