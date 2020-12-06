import fs from 'fs';
import path from 'path';
import generateTree from './treeBuilder.js';
import format from './formatters/index.js';
import parse from './parsers.js';

const getFullPath = (fileName) => path.resolve(process.cwd(), fileName);
const getExtension = (filePath) => path.extname(filePath).substr(1);
const readFile = (filePath) => fs.readFileSync(filePath, 'utf-8');

const getFileData = (fileName) => {
  const filePath = getFullPath(fileName);

  return parse(readFile(filePath), getExtension(filePath));
};

export default (filename1, filename2, formatName = 'stylish') => {
  const data1 = getFileData(filename1);
  const data2 = getFileData(filename2);

  const diffData = generateTree(data1, data2);

  return format(diffData, formatName);
};
