import _ from 'lodash';

const getFormatValue = (value) => {
  if (_.isObject(value)) return '[complex value]';

  if (_.isString(value)) return `'${value}'`;

  return value;
};

const getFormatPath = (path) => path.join('.');

const generateRowsFromChildren = (obj, path, fn) => Object
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
  `Property '${getFormatPath(path)}' ${postfix[item.type](item)}`
);

const generateRow = (path, item) => (
  _.has(item, 'children')
    ? generateRowsFromChildren(item.children, [...path, item.key], generateRow)
    : getFormatRow(path, item)
);

export default (parsedData) => {
  const iter = (data, path = []) => data
    .reduce((acc, item) => {
      if (_.has(item, 'children')) {
        return [...acc, iter(item.children, [...path, item.key])];
      }

      if (item.type !== 'equal') {
        return [...acc, generateRow([...path, item.key], item)];
      }

      return acc;
    }, [])
    .join('\n');

  return iter(parsedData);
};
