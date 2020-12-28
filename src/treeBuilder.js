import _ from 'lodash';

const buildTreeChildren = (data1, data2) => {
  const keys = _.union(_.keys(data1), _.keys(data2));
  const sortedKeys = _.sortBy(keys);

  const diffTree = sortedKeys.map((key) => {
    if (!_.has(data1, key)) {
      return { type: 'added', key, value: data2[key] };
    }

    if (!_.has(data2, key)) {
      return { type: 'removed', key, value: data1[key] };
    }

    if (_.isPlainObject(data1[key]) && _.isPlainObject(data2[key])) {
      return {
        type: 'nested',
        key,
        children: buildTreeChildren(data1[key], data2[key]),
      };
    }

    if (_.isEqual(data1[key], data2[key])) {
      return { type: 'unchanged', key, value: data1[key] };
    }

    return {
      type: 'changed',
      key,
      oldValue: data1[key],
      value: data2[key],
    };
  });

  return diffTree;
};

export default (data1, data2) => ({
  type: 'nested',
  children: buildTreeChildren(data1, data2),
});
