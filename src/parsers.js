import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import _ from 'lodash';
import { isObject } from './helpers.js';

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
 * Deep merge two objects.
 * @param firstData
 * @param ...secondData
 */
const parse = (path1, path2) => {
  const firstFileData = getFileData(path1);
  const secondFileData = getFileData(path2);

  const parseProcess = (firstData, secondData) => {
    const secondDataKeys = Object.keys(secondData);
    if (!secondDataKeys.length) return firstData;

    const merged = { ...firstData, ...secondData };

    const parsed = Object
      .keys(merged)
      .reduce((acc, key) => {
        if (isObject(firstData[key]) && isObject(secondData[key])) {
          return [...acc, {
            type: 'equal',
            key,
            children: parseProcess(firstData[key], secondData[key]),
          }];
        }

        if (_.isEqual(firstData[key], secondData[key])) {
          return [...acc, { type: 'equal', key, value: firstData[key] }];
        }

        if (_.has(firstData, key) && _.has(secondData, key)) {
          return [...acc, {
            type: 'updating',
            key,
            oldValue: firstData[key],
            value: secondData[key],
          }];
        }

        if (_.has(firstData, key)) {
          return [...acc, { type: 'missing', key, value: firstData[key] }];
        }

        if (_.has(secondData, key)) {
          return [...acc, { type: 'adding', key, value: secondData[key] }];
        }

        return acc;
      }, []);

    return _.sortBy(parsed, 'key');
  };

  return parseProcess(firstFileData, secondFileData);
};

export default parse;
