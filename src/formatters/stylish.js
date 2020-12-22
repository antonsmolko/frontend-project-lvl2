import _ from 'lodash';

const baseIndent = '  ';
const doubleIndent = _.repeat(baseIndent, 2);
const getIndent = (depth) => _.repeat(doubleIndent, depth);

const getSignIndent = (type) => {
  switch (type) {
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
const getFormattedIndentWithKey = (key, depth, type = null) => (
  getFullIndent(type, depth) + formatKey(key)
);

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
    .map((obj) => iter(obj, depth))
    .join('')
);

export default (tree) => {
  const iter = (obj, depth = 0) => {
    const keyString = getFormattedIndentWithKey(obj.key, obj.type, depth);

    const inner = _.has(obj, 'children')
      ? `${keyString}{\n${mapChildren(obj.children, depth + 1, iter)}${getIndent(depth)}}`
      : `${keyString}${formatValue(obj.value, depth + 1)}`;

    return `${inner}\n`;
  };

  return iter(tree);
};
