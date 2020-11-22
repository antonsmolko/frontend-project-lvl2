import path from 'path';
import fs from 'fs';
import yaml from 'js-yaml';
import formatters from './formatters/index.js';

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
const getJsonFileData = (filePath) => {
  const info = fs.readFileSync(filePath, 'utf-8');

  return JSON.parse(info);
};

/**
 * Returns file data from yml format
 *
 * @param {string} filePath
 */
const getYmlFileData = (filePath) => (
  yaml.safeLoad(fs.readFileSync(filePath, 'utf8'))
);

/**
 * @constant {object} fileDataMap
 */
const fileDataMap = {
  json: (filePath) => getJsonFileData(filePath),
  yml: (filePath) => getYmlFileData(filePath),
};

/**
 * Returns file data
 *
 * @param {string} filePath
 * @return {object}
 */
const getFileData = (filePath) => {
  try {
    const ext = path.extname(filePath).substr(1);

    return fileDataMap[ext](filePath);
  } catch (e) {
    console.log(`File '${filePath}' not found!`);
    throw new Error(e);
  }
};

/**
 * Returns template of compared result two object of data
 */
export default async (filename1, filename2, formatName = 'stylish') => {
  const path1 = await getFullPath(filename1);
  const path2 = await getFullPath(filename2);
  console.log('path1 ', path1);

  const data1 = getFileData(path1);
  const data2 = getFileData(path2);

  const formatter = formatters(formatName);

  return formatter(data1, data2);
};
