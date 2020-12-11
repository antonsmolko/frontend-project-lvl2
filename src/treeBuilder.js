import _ from 'lodash';

const generateDiffTree = (firstData, secondData) => {
  const keys = _.union(_.keys(firstData), _.keys(secondData));
  const sortedKeys = _.sortBy(keys);

  const diffTree = sortedKeys
    .map((key) => {
      const firstDataVal = firstData[key];
      const secondDataVal = secondData[key];

      if (!_.has(firstData, key)) return { type: 'added', key, value: secondDataVal };

      if (_.has(firstData, key) && _.has(secondData, key)) {
        if (_.isPlainObject(firstDataVal) && _.isPlainObject(secondDataVal)) {
          return {
            type: 'equal',
            key,
            children: generateDiffTree(firstDataVal, secondDataVal),
          };
        }

        if (_.isEqual(firstDataVal, secondDataVal)) return { type: 'equal', key, value: firstDataVal };

        return {
          type: 'updated', key, oldValue: firstDataVal, value: secondDataVal,
        };
      }

      return { type: 'removed', key, value: firstDataVal };
    });

  return diffTree;
};

export default generateDiffTree;
