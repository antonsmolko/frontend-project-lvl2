import parse from '../parser.js';
import { isObject } from '../helpers.js';

const tab = '    ';

const formatObjectValue = (obj, offset, fn) => {
  const inner = Object
    .keys(obj)
    .reduce((acc, key) => {
      const output = isObject(obj[key])
        ? fn(key, formatObjectValue(obj[key], offset + tab, fn), tab, offset)
        : fn(key, obj[key], tab, offset);
      return acc + output;
    }, '');

  return `{${inner}\n${offset}}`;
};

const formatString = (key, value, sign, offset) => (
  isObject(value)
    ? `\n${offset}${sign}${key}: ${formatObjectValue(value, offset + tab, formatString)}`
    : `\n${offset}${sign}${key}: ${value}`
);

const signMap = {
  equal: tab,
  object: tab,
  updating: '  - ',
  missing: '  - ',
  adding: '  + ',
};

export default (data1, data2) => {
  const parsedData = parse(data1, data2);

  const iter = (data, offset = '') => {
    const newOffset = offset + tab;
    const formattedData = data.reduce((acc, item) => {
      const {
        key,
        value,
        oldValue,
        type,
      } = item;

      const sign = signMap[type];

      let output = '';

      if (type === 'object') {
        output = formatString(key, iter(value, newOffset), sign, offset);
      } else {
        output = type === 'updating'
          ? formatString(key, oldValue, signMap.missing, offset)
          + formatString(key, value, signMap.adding, offset)
          : formatString(key, value, sign, offset);
      }

      return acc + output;
    }, '');

    return `{${formattedData}\n${offset}}`;
  };

  return iter(parsedData);
};
