import _ from 'lodash';

const baseIndent = '  ';
const doubleIndent = _.repeat(baseIndent, 2);
const getIndent = (depth) => _.repeat(doubleIndent, depth);

const getSignIndent = (type) => {
  switch (type) {
    case 'parent':
    case 'unchanged':
      return doubleIndent;
    case 'removed':
      return `${baseIndent}- `;
    case 'added':
      return `${baseIndent}+ `;
    default:
      return '';
  }
};

const getFullIndent = (depth, type = null) => getIndent(depth - 1) + getSignIndent(type);
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
  children
    .map((node) => iter(node, depth))
    .join('')
);

export default (tree) => {
  const iter = (node, depth = 0) => {
    const getKeyString = (type) => (
      getFormattedIndentWithKey(node.key, depth, type)
    );

    if (node.type === 'changed') {
      return `${getKeyString('removed')}${formatValue(node.oldValue, depth + 1)}\n`
        + `${getKeyString('added')}${formatValue(node.value, depth + 1)}\n`;
    }

    const inner = node.type === 'parent'
      ? `${getKeyString(node.type)}{\n${mapChildren(node.children, depth + 1, iter)}${getIndent(depth)}}`
      : `${getKeyString(node.type)}${formatValue(node.value, depth + 1)}`;

    return depth > 0 ? `${inner}\n` : inner;
  };

  return iter(tree);
};
