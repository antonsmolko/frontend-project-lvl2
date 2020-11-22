import path from 'path';
import { promises as fs } from 'fs';
import genDiff from '../index.js';

const getFixturePath = (filename) => path.join('__fixtures__', filename);
const readFile = (filename) => fs.readFile(getFixturePath(filename), 'utf-8');

const formats = [['json'], ['yml']];

describe
  .each(formats)('Test Diff with .%s format', (format) => {
    const path1 = getFixturePath(`/file1.${format}`);
    const path2 = getFixturePath(`/file2.${format}`);

    test('Stylish Test', async () => {
      const diff = genDiff(path1, path2);
      const stylishResult = await readFile('/stylish.txt');
      expect(diff).toBe(stylishResult);
    });

    test('Plain Test', async () => {
      const diff = genDiff(path1, path2, 'plain');
      const plainResult = await readFile('/plain.txt');
      expect(diff).toBe(plainResult);
    });

    test('Json Test', async () => {
      const diff = genDiff(path1, path2, 'json');
      const jsonResult = await readFile('/json.txt');
      expect(diff).toBe(jsonResult);
    });
  });
