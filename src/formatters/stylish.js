import _ from 'lodash';

const indent = (depth, spacesCount = 4) => (' ').repeat(depth * spacesCount - 2);

const stringify = (value, depth) => {
  if (!_.isPlainObject(value)) {
    return value;
  }

  const inner = Object.entries(value).map(([key, val]) => `${indent(depth + 1)}  ${key}: ${stringify(val, depth + 1)}`).join('\n');

  return `{\n${inner}\n${indent(depth)}  }`;
};

export default (tree) => {
  const iter = (node, depth) => {
    switch (node.type) {
      case 'root': {
        return `{\n${node.children.map((child) => iter(child, depth + 1)).join('\n')}\n}`;
      }
      case 'nested': {
        return `${indent(depth)}  ${node.key}: {\n${node.children.map((child) => iter(child, depth + 1)).join('\n')}\n${indent(depth)}  }`;
      }
      case 'changed': {
        const oldValue = `${indent(depth)}- ${node.key}: ${stringify(node.oldValue, depth)}\n`;
        const newValue = `${indent(depth)}+ ${node.key}: ${stringify(node.newValue, depth)}`;

        return `${oldValue}${newValue}`;
      }
      case 'unchanged': {
        return `${indent(depth)}  ${node.key}: ${stringify(node.value, depth)}`;
      }
      case 'added': {
        return `${indent(depth)}+ ${node.key}: ${stringify(node.value, depth)}`;
      }
      case 'removed': {
        return `${indent(depth)}- ${node.key}: ${stringify(node.value, depth)}`;
      }
      default: {
        throw new Error(`Unknown node type: '${node.type}'!`);
      }
    }
  };

  return iter(tree, 0);
};
