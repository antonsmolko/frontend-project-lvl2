import _ from 'lodash';

const getIndent = (depth, decrement = 0) => (' ').repeat(depth * 4 - decrement);

const formatObjectValue = (obj, depth, format) => {
  const inner = Object.keys(obj)
    .map((key) => {
      if (_.isPlainObject(obj[key])) {
        return `${key}: ${formatObjectValue(obj[key], depth + 1, format)}`;
      }

      return `${key}: ${format(obj[key], depth)}`;
    })
    .join(`\n${getIndent(depth)}`);

  return `{\n${getIndent(depth)}${inner}\n${getIndent(depth - 1)}}`;
};

const formatValue = (value, depth) => {
  if (_.isPlainObject(value)) {
    return formatObjectValue(value, depth, formatValue);
  }

  return value;
};

export default (tree) => {
  const iter = (node, depth = 0) => {
    switch (node.type) {
      case 'root':
        return `{\n${node.children.map((child) => iter(child, depth + 1)).join('')}${getIndent(depth)}}`;
      case 'nested':
        return `${getIndent(depth)}${node.key}: {\n${node.children.map((child) => iter(child, depth + 1)).join('')}${getIndent(depth)}}\n`;
      case 'changed':
        return `${getIndent(depth, 2)}- ${node.key}: ${formatValue(node.oldValue, depth + 1)}\n${getIndent(depth, 2)}+ ${node.key}: ${formatValue(node.newValue, depth + 1)}\n`;
      case 'unchanged':
        return `${getIndent(depth)}${node.key}: ${formatValue(node.value, depth + 1)}\n`;
      case 'added':
        return `${getIndent(depth, 2)}+ ${node.key}: ${formatValue(node.value, depth + 1)}\n`;
      case 'removed':
        return `${getIndent(depth, 2)}- ${node.key}: ${formatValue(node.value, depth + 1)}\n`;
      default:
        throw new Error(`Unknown node type: '${node.type}'!`);
    }
  };

  return iter(tree);
};
