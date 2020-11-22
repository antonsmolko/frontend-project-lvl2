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

const formats = ['json', 'yml'];

formats.forEach(async (format) => {
  const path1 = await getFixturePath(`/file1.${format}`);
  const path2 = await getFixturePath(`/file2.${format}`);

  describe(`Test Diff with .${format} format`, () => {
    test('Stylish Test', async () => {
      const diff = await genDiff(path1, path2);
      expect(diff).toBe(stylishResult);
    });

    test('Plain Test', async () => {
      const diff = await genDiff(path1, path2, 'plain');
      expect(diff).toBe(plainResult);
    });

    test('Json Test', async () => {
      const diff = await genDiff(path1, path2, 'json');
      expect(diff).toBe(jsonResult);
    });
  });
});
