import genDiff from '../index.js';
import path from 'path';
import { promises as fs } from 'fs';

const  getFixturePath = (filename) => path.join('__fixtures__', filename);
const readFile = (filename) => fs.readFile(getFixturePath(filename), 'utf-8');

let expected;
beforeEach(async () => {
  expected = await readFile('/result.txt');
});

test('Json Diff Test', async () => {
  const filePath1 = await getFixturePath('/file1.json');
  const filePath2 = await getFixturePath('/file2.json');

  const diff = await genDiff(filePath1, filePath2)

  expect(diff).toBe(expected);
});

test('Yml Diff Test', async () => {
  const filePath1 = await getFixturePath('/file1.yml');
  const filePath2 = await getFixturePath('/file2.yml');

  const diff = await genDiff(filePath1, filePath2);

  expect(diff).toBe(expected);
});