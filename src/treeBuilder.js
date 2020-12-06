import _ from 'lodash';

const generateDiffTree = (target, sources) => {
  const keys = _.union(_.keys(target), _.keys(sources));

  const diffTree = keys
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
            children: generateDiffTree(targetVal, sourcesVal),
          };
        }

        return _.isEqual(targetVal, sourcesVal)
          ? { type: 'equal', key, value: targetVal }
          : {
            type: 'updated', key, oldValue: targetVal, value: sourcesVal,
          };
      }

      return hasValTarget
        ? { type: 'missed', key, value: targetVal }
        : { type: 'added', key, value: sourcesVal };
    });

  return _.sortBy(diffTree, 'key');
};

export default generateDiffTree;
