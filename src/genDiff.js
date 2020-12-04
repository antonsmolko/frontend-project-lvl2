import fs from 'fs';
import path from 'path';
import generateTree from './diffAstGenerator.js';
import format from './formatters/index.js';
import parse from './parsers.js';

const getFullPath = (fileName) => path.resolve(process.cwd(), fileName);
const getExtension = (filePath) => path.extname(filePath).substr(1);
const readFile = (filePath) => fs.readFileSync(filePath, 'utf-8');

const getFileData = (fileName) => {
  const filePath = getFullPath(fileName);
  const extension = getExtension(filePath);
  const data = readFile(filePath);

  return parse(data, extension);
};

export default (filename1, filename2, formatName = 'stylish') => {
  const data1 = getFileData(filename1);
  const data2 = getFileData(filename2);

  const diffData = generateTree(data1, data2);

  return format(diffData, formatName);
};
