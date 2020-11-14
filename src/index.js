import _ from 'lodash'
import path from 'path';
import fs from 'fs';

const getFullPath = async (filePath) => await path.resolve(process.cwd(), filePath);
const getFileInfo = (path) => {
  try {
    return fs.readFileSync(path, 'utf-8');
  } catch (e) {
    console.log(`File '${path}' not found!`);
    throw new Error(e);
  }
};

const getFileData = async (path) => await JSON.parse(getFileInfo(path));

const genDiff = async (file1, file2) => {
  const path1 = await getFullPath(file1);
  const path2 = await getFullPath(file2);

  const data1 = await getFileData(path1);
  const data2 = await getFileData(path2);

  const union = Object.assign({}, data2, data1);
  const objRowToString = (obj, key, sign = ' ') => `\n  ${sign} ${key}: ${obj[key]}`;

  const result = Object
    .keys(union)
    .sort()
    .reduce((acc, key) => {
      if (_.has(data2, key)) {
        if (data2[key] === union[key]) {
          acc += objRowToString(data2, key);
        } else {
          acc += objRowToString(data2, key, '-');
          acc += objRowToString(data1, key, '+');
        }
      } else {
        acc += objRowToString(data1, key, '-');
      }

      return acc;
    }, '');

  return `\n{${result}\n}\n`;
};

export default genDiff;
