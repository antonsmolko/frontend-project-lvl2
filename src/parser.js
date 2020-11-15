import _ from 'lodash';

/**
 * Returns compared string with sign
 *
 * @param {object} obj file data
 * @param {string} key object data key
 * @param {string} sign ' ', '+', '-'
 *
 * @return {string} '  + paramOne: 20'
 */
const objRowToString = (obj, key, sign = ' ') => `\n  ${sign} ${key}: ${obj[key]}`;

/**
 * Returns template of compared result two object of data
 *
 * @param {object} data1
 * @param {object} data2
 *
 * @return {string} '{}'
 */
export default async (data1, data2) => {
  const union = { ...data2, ...data1 };

  const result = Object
    .keys(union)
    .sort()
    .reduce((acc, key) => {
      let output = acc;

      if (_.has(data2, key)) {
        if (data2[key] === union[key]) {
          const sign = _.has(data1, key) ? ' ' : '+';
          output += objRowToString(data2, key, sign);
        } else {
          output += objRowToString(data1, key, '-');
          output += objRowToString(data2, key, '+');
        }
      } else {
        output += objRowToString(data1, key, '-');
      }

      return output;
    }, '');

  return `{${result}\n}`;
};
