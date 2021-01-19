import _ from 'lodash';

const indent = (depth, spacesCount = 4) => (' ').repeat(depth * spacesCount - 2);

const stringify = (value, depth) => {
  if (!_.isPlainObject(value)) {
    return value;
  }

  const inner = Object.entries(value).map(([key, val]) => `${indent(depth + 0.5)}${key}: ${stringify(val, depth + 1)}`).join('\n');

  return `{\n${inner}\n${indent(depth - 0.5)}}`;
};

export default (tree) => {
  const iter = (node, depth = 0) => {
    switch (node.type) {
      case 'root':
        return `{\n${node.children.map((child) => iter(child, depth + 1)).join('')}}`;
      case 'nested':
        return `${indent(depth + 0.5)}${node.key}: {\n${node.children.map((child) => iter(child, depth + 1)).join('')}${indent(depth + 0.5)}}\n`;
      case 'changed':
        return `${indent(depth)}- ${node.key}: ${stringify(node.oldValue, depth + 1)}\n${indent(depth)}+ ${node.key}: ${stringify(node.newValue, depth + 1)}\n`;
      case 'unchanged':
        return `${indent(depth + 0.5)}${node.key}: ${stringify(node.value, depth + 1)}\n`;
      case 'added':
        return `${indent(depth)}+ ${node.key}: ${stringify(node.value, depth + 1)}\n`;
      case 'removed':
        return `${indent(depth)}- ${node.key}: ${stringify(node.value, depth + 1)}\n`;
      default:
        throw new Error(`Unknown node type: '${node.type}'!`);
    }
  };

  return iter(tree);
};
