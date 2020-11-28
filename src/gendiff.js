import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import generate from './diffGenerator.js';
import formatters from './formatters/index.js';

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

const parsers = {
  yml: (data) => yaml.safeLoad(data),
  json: (data) => JSON.parse(data),
};

const getFileData = (fileName) => {
  const filePath = getFullPath(fileName);
  const extension = getExtension(filePath);
  const data = readFile(filePath);

  return parsers[extension](data);
};

/**
 * Returns template of compared result two object of data
 */
export default (filename1, filename2, formatName = 'stylish') => {
  const data1 = getFileData(filename1);
  const data2 = getFileData(filename2);

  const diffData = generate(data1, data2);
  const formatter = formatters(formatName);

  return formatter(diffData);
};
