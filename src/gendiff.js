import _ from 'lodash';
import path from 'path';
import fs from 'fs';

/**
 * Returns absolute file path
 *
 * @param {string} filePath
 */
const getFullPath = async (filePath) => {
  const fullPath = await path.resolve(process.cwd(), filePath);

  return fullPath;
};

/**
 * Returns file data from json stringifying format
 *
 * @param {string} filePath
 */
const getFileInfo = (filePath) => {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch (e) {
    console.log(`File '${filePath}' not found!`);
    throw new Error(e);
  }
};

/**
 * Returns parsed data of file
 *
 * @param {string} path
 */
const getFileData = async (filePath) => {
  const info = await getFileInfo(filePath);

  return JSON.parse(info);
};

export default async (filename1, filename2) => {
  const path1 = await getFullPath(filename1);
  const path2 = await getFullPath(filename2);

  const data1 = await getFileData(path1);
  const data2 = await getFileData(path2);

  const union = { ...data2, ...data1 };
  const objRowToString = (obj, key, sign = ' ') => `\n  ${sign} ${key}: ${obj[key]}`;

  const result = Object
    .keys(union)
    .sort()
    .reduce((acc, key) => {
      if (_.has(data2, key)) {
        if (data2[key] === union[key]) {
          const sign = _.has(data1, key) ? ' ' : '+';
          acc += objRowToString(data2, key, sign);
        } else {
          acc += objRowToString(data1, key, '-');
          acc += objRowToString(data2, key, '+');
        }
      } else {
        acc += objRowToString(data1, key, '-');
      }

      return acc;
    }, '');

  return `{${result}\n}`;
};
