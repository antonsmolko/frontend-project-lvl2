import _ from 'lodash';

const getFormatValue = (value) => {
  if (_.isObject(value)) return '[complex value]';
  if (_.isString(value)) return `'${value}'`;

  return value;
};

const getFormatPath = (path) => _.compact(path).join('.');

const generateRowsFromChildren = (children, path, generateRow) => (
  children
    .reduce((acc, node) => [...acc, generateRow([...path, node.key], node.key)], '')
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
  item.type === 'parent'
    ? generateRowsFromChildren(item.children, path, generateRow)
    : getFormatRow(path, item)
);

export default (tree) => {
  const iter = (node, path = [], carry = []) => {
    if (node.type === 'parent') {
      return [...carry, node.children
        .reduce((acc, item) => [...acc, ...iter(item, [...path, node.key])], [])
        .join('\n')];
    }

    if (node.type !== 'unchanged') {
      return [...carry, generateRow([...path, node.key], node)];
    }

    return carry;
  };

  return iter(tree).join('\n');
};
