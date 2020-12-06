import _ from 'lodash';

const generateDiffAst = (target, sources) => {
  const keys = _.union(_.keys(target), _.keys(sources)).sort();

  const diffAst = keys
    .reduce((acc, key) => {
      if (_.has(target, key) && _.has(sources, key)) {
        if (_.isPlainObject(target[key]) && _.isPlainObject(sources[key])) {
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

  return diffAst;
};

export default generateDiffAst;
