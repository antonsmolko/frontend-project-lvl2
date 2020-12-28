import _ from 'lodash';

const getFormattedValue = (value) => {
  if (_.isObject(value)) return '[complex value]';
  if (_.isString(value)) return `'${value}'`;

  return value;
};

const getFormattedPath = (path) => _.compact(path).join('.');

const generateRowsFromChildren = (children, path, generateRow) => (
  children
    .reduce((acc, node) => [...acc, generateRow([...path, node.key], node.key)], '')
    .join('\n')
);

const getFormattedRow = (path, item) => {
  const firstPartRow = `Property '${getFormattedPath(path)}'`;

  switch (item.type) {
    case 'added':
      return `${firstPartRow} was added with value: ${getFormattedValue(item.value)}`;
    case 'changed':
      return `${firstPartRow} was updated. From ${getFormattedValue(item.oldValue)} to ${getFormattedValue(item.value)}`;
    case 'removed':
      return `${firstPartRow} was removed`;
    default:
      return '';
  }
};

const generateRow = (path, item) => (
  item.type === 'nested'
    ? generateRowsFromChildren(item.children, path, generateRow)
    : getFormattedRow(path, item)
);

export default (tree) => {
  const iter = (node, path = []) => {
    if (node.type === 'nested') {
      return _.compact(node.children
        .flatMap((item) => iter(item, [...path, node.key])))
        .join('\n');
    }

    if (node.type !== 'unchanged') {
      return generateRow([...path, node.key], node);
    }

    return '';
  };

  return iter(tree);
};
