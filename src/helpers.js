import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

/**
 * Simple object check.
 *
 * @param item
 * @returns {boolean}
 */
export const isObject = (item) => (
  item && typeof item === 'object' && !Array.isArray(item)
);

/**
 * Returns absolute file path
 *
 * @param {string} filePath
 */
const getFullPath = (filePath) => {
  const fullPath = path.resolve(process.cwd(), filePath);

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
export const readFile = (fileName) => {
  const filePath = getFullPath(fileName);

  try {
    const ext = path.extname(filePath).substr(1);

    return fileDataMap[ext](filePath);
  } catch (e) {
    console.log(`File '${filePath}' not found!`);
    throw new Error(e);
  }
};

export default {
  isObject,
  readFile,
};
