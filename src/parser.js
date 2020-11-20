import _ from 'lodash';

/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

function getDefaultAst(obj) {
  return Object
    .keys(obj)
    .reduce((acc, key) => {
      const item = {
        type: 'default',
        key,
        isObjectValue: isObject(obj[key]),
        value: isObject(obj[key]) ? getDefaultAst(obj[key]) : obj[key]
      };

      acc.push(item);

      return acc;
    }, []);
}

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
const parse = (target, sources) => {
  const sourcesKeys = Object.keys(sources);
  if (!sourcesKeys.length) return target;

  const merged = { ...target, ...sources};

  return Object
    .keys(merged)
    .sort()
    .reduce((acc, key) => {
      if (_.has(target, key)) {
        if (_.isEqual(target[key],  merged[key])) {
          acc.push({
            type: _.has(sources, key) ? 'default' : 'missing',
            key,
            isObjectValue: isObject(target[key]),
            value: isObject(target[key]) ? getDefaultAst(target[key]) : target[key]
          });
        } else if (isObject(target[key])) {
          if (_.has(sources, key)) {
            if (isObject(sources[key])) {
              acc.push({
                type: 'default',
                key,
                isObjectValue: true,
                value: parse(target[key], merged[key])
              })
            } else {
               acc.push({
                type: 'missing',
                key,
                isObjectValue: isObject(target[key]),
                value: isObject(target[key]) ? getDefaultAst(target[key]) : target[key]
              })
              acc.push({
                type: 'adding',
                key,
                isObjectValue: false,
                value: sources[key]
              })
            }
          } else {
            acc.push({
              type: 'missing',
              key,
              isObjectValue: true,
              value: getDefaultAst(target[key])
            })
          }
        } else {
          acc.push({
            type: 'missing',
            key,
            isObjectValue: false,
            value: target[key],
          });
          acc.push({
            type: 'adding',
            key,
            isObjectValue: false,
            value: merged[key],
          });
        }
      } else if (_.has(sources, key)) {
        acc.push({
          type: 'adding',
          key,
          isObjectValue: isObject(sources[key]),
          value: isObject(sources[key]) ? getDefaultAst(sources[key]) : sources[key]
        });
      }

      return acc;
    }, []);
}

export default parse;