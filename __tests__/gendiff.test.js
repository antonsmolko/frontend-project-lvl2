import path from 'path';
import { promises as fs } from 'fs';
import genDiff from '../index.js';

const getFixturePath = (filename) => path.join('__fixtures__', filename);
const readFile = (filename) => fs.readFile(getFixturePath(filename), 'utf-8');

let expected;
let expectedDeep;
beforeEach(async () => {
  expected = await readFile('/result.txt');
  expectedDeep = await readFile('/result-deep.txt');
});

test('Json Diff Test', async () => {
  const path1 = await getFixturePath('/file1.json');
  const path2 = await getFixturePath('/file2.json');

  const diff = await genDiff(path1, path2);

  expect(diff).toBe(expected);
});

test('Yml Diff Test', async () => {
  const path1 = await getFixturePath('/file1.yml');
  const path2 = await getFixturePath('/file2.yml');

  const diff = await genDiff(path1, path2);

  expect(diff).toBe(expected);
});

test('Json Stylish Test', async () => {
  const path1 = await getFixturePath('/file3.json');
  const path2 = await getFixturePath('/file4.json');

  const diff = await genDiff(path1, path2);

  expect(diff).toBe(expectedDeep);
});

test('Yml Stylish Test', async () => {
  const path1 = await getFixturePath('/file3.yml');
  const path2 = await getFixturePath('/file4.yml');

  const diff = await genDiff(path1, path2);

  expect(diff).toBe(expectedDeep);
});
