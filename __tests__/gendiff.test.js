import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import genDiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

const stylishResult = readFile('result_stylish.txt');
const plainResult = readFile('result_plain.txt');
const jsonResult = readFile('result_json.json');

const formats = [
  'json',
  'yml',
];

test
  .each(formats)('Test genDiff with .%s files', (format) => {
    const path2 = getFixturePath(`file2.${format}`);
    const path1 = getFixturePath(`file1.${format}`);

    expect(genDiff(path1, path2)).toEqual(stylishResult);
    expect(genDiff(path1, path2, 'stylish')).toEqual(stylishResult);
    expect(genDiff(path1, path2, 'plain')).toEqual(plainResult);
    expect(genDiff(path1, path2, 'json')).toEqual(jsonResult);
  });
