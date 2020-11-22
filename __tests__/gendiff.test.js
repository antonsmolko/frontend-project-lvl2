import path from 'path';
import { promises as fs } from 'fs';
import genDiff from '../index.js';

const getFixturePath = (filename) => path.join('__fixtures__', filename);
const readFile = (filename) => fs.readFile(getFixturePath(filename), 'utf-8');

let stylishResult;
let plainResult;
let jsonResult;

beforeEach(async () => {
  stylishResult = await readFile('/stylish.txt');
  plainResult = await readFile('/plain.txt');
  jsonResult = await readFile('/json.txt');
});

describe
  .each([['json'], ['yml']])('Test Diff with .%s format', (format) => {
    const path1 = getFixturePath(`/file1.${format}`);
    const path2 = getFixturePath(`/file2.${format}`);

    test('Stylish Test', () => {
      const diff = genDiff(path1, path2);
      expect(diff).toBe(stylishResult);
    });

    test('Plain Test', () => {
      const diff = genDiff(path1, path2, 'plain');
      expect(diff).toBe(plainResult);
    });

    test('Json Test', () => {
      const diff = genDiff(path1, path2, 'json');
      expect(diff).toBe(jsonResult);
    });
  });
