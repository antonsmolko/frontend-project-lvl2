import _ from 'lodash';

const tab = '    ';

const formatObjectValue = (obj, offset, fn) => {
  const inner = Object
    .keys(obj)
    .reduce((acc, key) => {
      const output = _.isPlainObject(obj[key])
        ? fn(key, formatObjectValue(obj[key], offset + tab, fn), tab, offset)
        : fn(key, obj[key], tab, offset);
      return acc + output;
    }, '');

  return `{${inner}\n${offset}}`;
};

const formatString = (key, value, sign, offset) => (
  _.isPlainObject(value)
    ? `\n${offset}${sign}${key}: ${formatObjectValue(value, offset + tab, formatString)}`
    : `\n${offset}${sign}${key}: ${value}`
);

const signMap = {
  equal: tab,
  updated: '  - ',
  removed: '  - ',
  added: '  + ',
};

export default (parsedData) => {
  const iter = (data, offset = '') => {
    const newOffset = offset + tab;
    const formattedData = data.reduce((acc, item) => {
      const sign = signMap[item.type];

      if (_.has(item, 'children')) {
        return acc + formatString(item.key, iter(item.children, newOffset), sign, offset);
      }

      if (item.type === 'updated') {
        return acc + formatString(item.key, item.oldValue, signMap.removed, offset)
        + formatString(item.key, item.value, signMap.added, offset);
      }

      return acc + formatString(item.key, item.value, sign, offset);
    }, '');

    return `{${formattedData}\n${offset}}`;
  };

  return iter(parsedData);
};
