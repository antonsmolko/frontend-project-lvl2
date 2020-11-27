import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import genDiff from '../index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

const resultMap = {
  stylish: readFile('result_stylish.txt'),
  plain: readFile('result_plain.txt'),
  json: readFile('result_json.txt'),
};

const formats = ['json', 'yml'];

const matrix = Object.keys(resultMap).reduce((acc, formatter) => (
  [...acc, ...formats.map((format) => [formatter, format])]
), []);

test
  .each(matrix)('Test genDiff with %s formatter, %s file format', (formatter, format) => {
    const path2 = getFixturePath(`file2.${format}`);
    const path1 = getFixturePath(`file1.${format}`);

    const diff = genDiff(path1, path2, formatter);
    const expected = resultMap[formatter];
    expect(diff).toEqual(expected);
  });
