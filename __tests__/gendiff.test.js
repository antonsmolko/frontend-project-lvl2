import genDiff from '../index.js';
import path from 'path';
import { promises as fs } from 'fs';

const  getFixturePath = (filename) => path.join('__fixtures__', filename);
const readFile = (filename) => fs.readFile(getFixturePath(filename), 'utf-8');

test('Json Diff Test', async () => {
  const filePath1 = await getFixturePath('/json/file1.json');
  const filePath2 = await getFixturePath('/json/file2.json');
  const expected = await readFile('/json/result.txt');

  const diff = await genDiff(filePath1, filePath2)

  expect(diff).toBe(expected);
});