import parser from './parser.js';

/**
 * Returns compared string with sign
 *
 * @param {object} obj file data
 * @param {string} key object data key
 * @param {string} sign ' ', '+', '-'
 *
 * @return {string} '  + paramOne: 20'
 */
const formatString = (key, getValue, sign, offset) => (
  `\n${offset}${sign} ${key}: ${getValue()}`
);

/**
 * @constant {string} tab
 */
const tab = '    ';

const stylish = (data1, data2) => {
  const parsedData = parser(data1, data2);

  const signMap = {
    default: '   ',
    missing: '  -',
    adding: '  +'
  };

  const iter = (data, offset = '') => {
    const newOffset = offset + tab
    const formattedData = data.reduce((acc, item) => {
      let output = acc;
      const { key, value, isObjectValue, type } = item;
      const sign = signMap[type];
      const val = isObjectValue
        ? () => iter(value, newOffset)
        : () => value;

      output += formatString(key, val, sign, offset);

      return output;
    }, '');

    return `{${formattedData}\n${offset}}`;
  };

  return iter(parsedData);
}

export default stylish;