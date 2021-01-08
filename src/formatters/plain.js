import _ from 'lodash';

const stringify = (value) => {
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
    switch (node.type) {
      case 'root':
        return node.children.flatMap((child) => iter(child, []));
      case 'nested':
        return node.children.flatMap((child) => iter(child, [...parents, node.key]));
      case 'added':
        return `Property '${generatePath(parents, node.key)}' was added with value: ${stringify(node.value)}`;
      case 'removed':
        return `Property '${generatePath(parents, node.key)}' was removed`;
      case 'changed':
        return `Property '${generatePath(parents, node.key)}' was updated. From ${stringify(node.oldValue)} to ${stringify(node.newValue)}`;
      case 'unchanged':
        return [];
      default:
        throw new Error(`Unknown node type: '${node.type}'!`);
    }
  };

  return iter(tree).join('\n');
};
