import _ from 'lodash';

const space = ' ';
const getIndent = (depth, numSpaces = 4) => _.repeat(space, numSpaces * depth);
const getIndentBySign = (sign) => `${_.repeat(space, 2)}${sign}${space}`;

const getIndentByType = (type) => {
  switch (type) {
    case 'nested':
    case 'unchanged':
      return getIndentBySign(space);
    case 'removed':
      return getIndentBySign('-');
    case 'added':
      return getIndentBySign('+');
    default:
      throw new Error(`Unknown node type: '${type}'!`);
  }
};

const getFullIndent = (depth, type = null) => getIndent(depth - 1) + getIndentByType(type);
const formatKey = (key) => (key ? `${key}: ` : '');
const getFormattedIndentWithKey = (key, depth, type = null) => {
  const indent = depth ? getFullIndent(depth, type) : '';
  return indent + formatKey(key);
};

const formatKeyValue = (key, value) => `${key}: ${value}`;

const formatObjectValue = (obj, depth, format) => {
  const inner = Object.keys(obj)
    .map((key) => (
      _.isPlainObject(obj[key])
        ? formatKeyValue(key, formatObjectValue(obj[key], depth + 1, format))
        : formatKeyValue(key, format(obj[key], depth))
    ))
    .join(`\n${getIndent(depth)}`);

  return `{\n${getIndent(depth)}${inner}\n${getIndent(depth - 1)}}`;
};

const formatValue = (value, depth) => (
  _.isPlainObject(value)
    ? formatObjectValue(value, depth, formatValue)
    : value
);

const mapChildren = (children, depth, iter) => (
  children.map((node) => iter(node, depth)).join('')
);

export default (tree) => {
  const iter = (node, depth = 0) => {
    switch (node.type) {
      case 'root':
        return `${getFormattedIndentWithKey(node.key, depth, node.type)}{\n${mapChildren(node.children, depth + 1, iter)}${getIndent(depth)}}`;
      case 'nested':
        return `${getFormattedIndentWithKey(node.key, depth, node.type)}{\n${mapChildren(node.children, depth + 1, iter)}${getIndent(depth)}}\n`;
      case 'changed':
        return `${getFormattedIndentWithKey(node.key, depth, 'removed')}${formatValue(node.oldValue, depth + 1)}\n`
          + `${getFormattedIndentWithKey(node.key, depth, 'added')}${formatValue(node.newValue, depth + 1)}\n`;
      case 'unchanged':
      case 'added':
      case 'removed':
        return `${getFormattedIndentWithKey(node.key, depth, node.type)}${formatValue(node.value, depth + 1)}\n`;
      default:
        throw new Error(`Unknown node type: '${node.type}'!`);
    }
  };

  return iter(tree);
};
