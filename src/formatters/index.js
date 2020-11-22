import _ from 'lodash';
import stylish from './stylish.js';
import plain from './plain.js';
import json from './json.js';

const formatters = {
  stylish,
  plain,
  json,
};

export default (name) => {
  if (!_.has(formatters, name)) {
    throw new Error(`Unknown formatter by name: '${name}'!`);
  }

  return formatters[name];
};
