import _ from 'lodash';

const stringifyValue = (value) => {
  if (_.isObject(value)) {
    return '[complex value]';
  }

  if (_.isString(value)) {
    return `'${value}'`;
  }

  return value;
};

const generatePath = (parents, currentKey) => [...parents, currentKey].join('.');

export default (tree) => {
  const iter = (node, parents = []) => {
    const path = generatePath(parents, node.key);

    switch (node.type) {
      case 'root':
        return node.children.flatMap((item) => iter(item, []));
      case 'nested':
        return node.children.flatMap((item) => iter(item, [...parents, node.key]));
      case 'added':
        return `Property '${path}' was added with value: ${stringifyValue(node.value)}`;
      case 'removed':
        return `Property '${path}' was removed`;
      case 'changed':
        return `Property '${path}' was updated. From ${stringifyValue(node.oldValue)} to ${stringifyValue(node.newValue)}`;
      case 'unchanged':
        return [];
      default:
        throw new Error(`Unknown node type: '${node.type}'!`);
    }
  };

  return iter(tree).join('\n');
};
