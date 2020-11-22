import path from 'path';
import { promises as fs } from 'fs';
import genDiff from '../index.js';

const getFixturePath = (filename) => path.join('__fixtures__', filename);
const readFile = (filename) => fs.readFile(getFixturePath(filename), 'utf-8');

let expectedStylish;
let expectedPlain;
let path1;
let path2;

beforeEach(async () => {
  expectedStylish = await readFile('/stylish.txt');
  expectedPlain = await readFile('/plain.txt');
});

describe('Test Diff with Json', () => {
  beforeEach(async () => {
    path1 = await getFixturePath('/file1.json');
    path2 = await getFixturePath('/file2.json');
  });

  test('Json Stylish Test', async () => {
    const diff = await genDiff(path1, path2);
    expect(diff).toBe(expectedStylish);
  });

  test('Json Plain Test', async () => {
    const diff = await genDiff(path1, path2, 'plain');
    expect(diff).toBe(expectedPlain);
  });
});

describe('Test Diff with Yml', () => {
  beforeEach(async () => {
    path1 = await getFixturePath('/file1.yml');
    path2 = await getFixturePath('/file2.yml');
  });

  test('Yml Stylish Test', async () => {
    const diff = await genDiff(path1, path2);
    expect(diff).toBe(expectedStylish);
  });

  test('Yml Plain Test', async () => {
    const diff = await genDiff(path1, path2, 'plain');
    expect(diff).toBe(expectedPlain);
  });
});
