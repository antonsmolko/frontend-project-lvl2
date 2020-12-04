import _ from 'lodash';
import { isObject } from './helpers.js';

const generateDiffAst = (target, sources) => {
  const sourcesKeys = Object.keys(sources);
  if (!sourcesKeys.length) return target;

  const merged = { ...target, ...sources };

  const diffAst = Object
    .keys(merged)
    .reduce((acc, key) => {

      if (_.has(target, key) && _.has(sources, key)) {

        if (isObject(target[key]) && isObject(sources[key])) {
          return [...acc, {
            type: 'equal',
            key,
            children: generateDiffAst(target[key], sources[key]),
          }];
        }

        if (_.isEqual(target[key], sources[key])) {
          return [...acc, { type: 'equal', key, value: target[key] }];
        }

        return [...acc, {
          type: 'updating',
          key,
          oldValue: target[key],
          value: sources[key],
        }];
      }

      if (_.has(target, key)) {
        return [...acc, { type: 'missing', key, value: target[key] }];
      }

      if (_.has(sources, key)) {
        return [...acc, { type: 'adding', key, value: sources[key] }];
      }

      return acc;
    }, []);

  return _.sortBy(diffAst, 'key');
};

export default generateDiffAst;
