import fs from 'fs';
import path from 'path';
import generate from './src/diffAstGenerator.js';
import getFormatter from './src/formatters/index.js';
import parsers from './src/parsers.js';

const getFullPath = (fileName) => path.resolve(process.cwd(), fileName);
const getExtension = (filePath) => path.extname(filePath).substr(1);
const readFile = (filePath) => fs.readFileSync(filePath, 'utf-8');

const getFileData = (fileName) => {
  const filePath = getFullPath(fileName);
  const extension = getExtension(filePath);
  const data = readFile(filePath);

  return parsers[extension](data);
};

export default (filename1, filename2, formatName = 'stylish') => {
  const data1 = getFileData(filename1);
  const data2 = getFileData(filename2);

  const diffData = generate(data1, data2);
  const format = getFormatter(formatName);

  return format(diffData);
};
