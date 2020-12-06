import _ from 'lodash';

const generateDiffAst = (target, sources) => {
  const keys = _.union(_.keys(target), _.keys(sources));

  const diffAst = keys
    .map((key) => {
      const hasValTarget = _.has(target, key);
      const hasValSources = _.has(sources, key);
      const targetVal = target[key];
      const sourcesVal = sources[key];

      if (hasValTarget && hasValSources) {
        if (_.isPlainObject(targetVal) && _.isPlainObject(sourcesVal)) {
          return {
            type: 'equal',
            key,
            children: generateDiffAst(targetVal, sourcesVal),
          };
        }

        if (_.isEqual(targetVal, sourcesVal)) {
          return {
            type: 'equal',
            key,
            value: targetVal,
          };
        }

        return {
          type: 'updated',
          key,
          oldValue: targetVal,
          value: sourcesVal,
        };
      }

      if (hasValTarget) {
        return { type: 'missed', key, value: targetVal };
      }

      return { type: 'added', key, value: sourcesVal };
    });

  return _.sortBy(diffAst, 'key');
};

export default generateDiffAst;
