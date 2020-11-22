import _ from 'lodash';
import stylish from './stylish.js';
import plain from './plain.js';

const formatters = {
  stylish,
  plain,
};

export default (name) => {
  if (!_.has(formatters, name)) {
    throw new Error(`Unknown formatter by name: '${name}'!`);
  }

  return formatters[name];
};
