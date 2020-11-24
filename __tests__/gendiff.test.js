import path from 'path';
import fs from 'fs';
import genDiff from '../index.js';

const getFixturePath = (filename) => path.join('__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

const resultMap = {
  stylish: readFile('resultStylish.txt'),
  plain: readFile('resultPlain.txt'),
  json: readFile('resultJson.txt'),
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
