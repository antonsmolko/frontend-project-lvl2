import parse from './parsers.js';
import formatters from './formatters/index.js';
import { getFileData } from './helpers.js';

/**
 * Returns template of compared result two object of data
 */
export default (filename1, filename2, formatName = 'stylish') => {
  const data1 = getFileData(filename1);
  const data2 = getFileData(filename2);

  const parsedData = parse(data1, data2);
  const formatter = formatters(formatName);

  return formatter(parsedData);
};
