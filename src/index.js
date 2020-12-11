import fs from 'fs';
import path from 'path';
import buildTree from './treeBuilder.js';
import format from './formatters/index.js';
import parse from './parsers.js';

const getFullPath = (fileName) => path.resolve(process.cwd(), fileName);
const getFormat = (filePath) => path.extname(filePath).substr(1);
const readFile = (filePath) => fs.readFileSync(filePath, 'utf-8');

const getFileData = (fileName) => {
  const filePath = getFullPath(fileName);
  return parse(readFile(filePath), getFormat(filePath));
};

export default (path1, path2, formatName = 'stylish') => {
  const data1 = getFileData(path1);
  const data2 = getFileData(path2);

  const ast = buildTree(data1, data2);

  return format(ast, formatName);
};
