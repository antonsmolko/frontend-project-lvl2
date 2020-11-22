import _ from 'lodash';
import { isObject } from './helpers.js';

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
const parse = (target, sources) => {
  const sourcesKeys = Object.keys(sources);
  if (!sourcesKeys.length) return target;

  const merged = { ...target, ...sources };

  return Object
    .keys(merged)
    .sort()
    .reduce((acc, key) => {
      if (isObject(target[key]) && isObject(sources[key])) {
        acc.push({
          type: 'equal',
          key,
          children: parse(target[key], sources[key]),
        });
      } else if (_.isEqual(target[key], sources[key])) {
        acc.push({
          type: 'equal',
          key,
          value: target[key],
        });
      } else if (_.has(target, key) && _.has(sources, key)) {
        acc.push({
          type: 'updating',
          key,
          oldValue: target[key],
          value: sources[key],
        });
      } else {
        if (_.has(target, key)) {
          acc.push({
            type: 'missing',
            key,
            value: target[key],
          });
        }
        if (_.has(sources, key)) {
          acc.push({
            type: 'adding',
            key,
            value: sources[key],
          });
        }
      }

      return acc;
    }, []);
};

export default parse;
