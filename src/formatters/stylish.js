import _ from 'lodash';

const indent = (depth = 1, spacesCount = 4) => (' ').repeat(depth * spacesCount - 2);

const stringify = (value, depth) => {
  if (!_.isPlainObject(value)) {
    return value;
  }

  const inner = Object.entries(value).map(([key, val]) => `${indent(depth)}  ${key}: ${stringify(val, depth + 1)}`).join('\n');

  return `{\n${inner}\n${indent(depth - 1)}  }`;
};

export default (tree) => {
  const iter = (node, depth = 1) => {
    const oldValue = `${indent(depth)}- ${node.key}: ${stringify(node.oldValue, depth + 1)}\n`;
    const newValue = `${indent(depth)}+ ${node.key}: ${stringify(node.newValue, depth + 1)}`;

    switch (node.type) {
      case 'root':
        return node.children.map((child) => iter(child, depth));
      case 'nested':
        return `${indent(depth)}  ${node.key}: {\n${node.children.map((child) => iter(child, depth + 1)).join('\n')}\n${indent(depth)}  }`;
      case 'changed':
        return `${oldValue}${newValue}`;
      case 'unchanged':
        return `${indent(depth)}  ${node.key}: ${stringify(node.value, depth + 1)}`;
      case 'added':
        return `${indent(depth)}+ ${node.key}: ${stringify(node.value, depth + 1)}`;
      case 'removed':
        return `${indent(depth)}- ${node.key}: ${stringify(node.value, depth + 1)}`;
      default:
        throw new Error(`Unknown node type: '${node.type}'!`);
    }
  };

  return `{\n${iter(tree).join('\n')}\n}`;
};
