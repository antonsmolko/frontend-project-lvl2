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

export default (tree) => {
  const iter = (node, path = []) => {
    const currentPath = [...path, node.key];

    switch (node.type) {
      case 'root':
        return node.children.flatMap((item) => iter(item, [])).join('\n');
      case 'nested':
        return _.compact(node.children.flatMap((item) => iter(item, currentPath))).join('\n');
      case 'added':
        return `Property '${currentPath.join('.')}' was added with value: ${stringifyValue(node.value)}`;
      case 'changed':
        return `Property '${currentPath.join('.')}' was updated. From ${stringifyValue(node.oldValue)} to ${stringifyValue(node.newValue)}`;
      case 'removed':
        return `Property '${currentPath.join('.')}' was removed`;
      default:
        return '';
    }
  };

  return iter(tree);
};
