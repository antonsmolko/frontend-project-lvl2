import _ from 'lodash';

const getFormatValue = (value) => {
  if (_.isObject(value)) return '[complex value]';
  if (_.isString(value)) return `'${value}'`;

  return value;
};

const getFormatPath = (path) => _.compact(path).join('.');

const generateRowsFromChildren = (children, path, generateRow) => (
  children
    .reduce((acc, obj) => [...acc, generateRow([...path, obj.key], obj.key)], '')
    .join('\n')
);

const postfix = {
  added: ({ value }) => `was added with value: ${getFormatValue(value)}`,
  changed: ({ oldValue, value }) => (
    `was updated. From ${getFormatValue(oldValue)} to ${getFormatValue(value)}`
  ),
  removed: () => 'was removed',
};

const getFormatRow = (path, item) => (
  `Property '${getFormatPath(path)}' ${postfix[item.type](item)}`
);

const generateRow = (path, item) => (
  _.has(item, 'children')
    ? generateRowsFromChildren(item.children, path, generateRow)
    : getFormatRow(path, item)
);

export default (tree) => {
  const iter = (obj, path = [], carry = []) => {
    if (_.has(obj, 'children')) {
      return [...carry, obj.children
        .reduce((acc, item) => [...acc, ...iter(item, [...path, obj.key])], [])
        .join('\n')];
    }

    if (obj.type !== 'unchanged') {
      return [...carry, generateRow([...path, obj.key], obj)];
    }

    return carry;
  };

  return iter(tree).join('\n');
};
