import _ from 'lodash';
import parse from '../parser.js';

const getFormatValue = (value) => {
  if (_.isObject(value)) return '[complex value]';

  if (_.isString(value)) return `'${value}'`;

  return value;
};

const getFormatPath = (path) => path.join('.');

const generateRowsFromObject = (obj, path, fn) => Object
  .keys(obj)
  .reduce((acc, key) => [...acc, fn([...path, key], obj[key])], '')
  .join('\n');

const postfix = {
  adding: ({ value }) => `was added with value: ${getFormatValue(value)}`,
  missing: () => 'was removed',
  updating: ({ value, oldValue }) => (
    `was updated. From ${getFormatValue(oldValue)} to ${getFormatValue(value)}`
  ),
};

const getFormatRow = (path, item) => (
  `Property '${getFormatPath(path)}' ${postfix[item.state](item)}`
);

function generateRow(path, item) {
  const { state, key, value } = item;

  return state === 'object'
    ? generateRowsFromObject(value, [...path, key], generateRow)
    : getFormatRow(path, item);
}

export default (data1, data2) => {
  const parsedData = parse(data1, data2);

  const iter = (data, path = []) => data
    .reduce((acc, item) => {
      if (item.state === 'object') {
        return [...acc, iter(item.value, [...path, item.key])];
      }

      if (item.state !== 'equal') {
        return [...acc, generateRow([...path, item.key], item)];
      }

      return acc;
    }, [])
    .join('\n');

  return iter(parsedData);
};