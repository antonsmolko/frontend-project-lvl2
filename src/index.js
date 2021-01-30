import fs from 'fs';
import path from 'path';
import buildTree from './treeBuilder.js';
import format from './formatters/index.js';
import parse from './parsers.js';

const getFullPath = (filepath) => path.resolve(process.cwd(), filepath);
const getFormat = (filepath) => path.extname(filepath).substr(1);
const readFile = (filepath) => fs.readFileSync(filepath, 'utf-8');

const getFileData = (filename) => {
  const filepath = getFullPath(filename);
  return parse(readFile(filepath), getFormat(filepath));
};

export default (path1, path2, formatName = 'stylish') => {
  const data1 = getFileData(path1);
  const data2 = getFileData(path2);

  const ast = buildTree(data1, data2);

  return format(ast, formatName);
};
