import _ from 'lodash';
import stylish from './stylish.js';
import plain from './plain.js';
import json from './json.js';

const formatters = {
  stylish,
  plain,
  json,
};

export default (tree, name) => {
  if (!_.has(formatters, name)) {
    throw new Error(`Unknown formatter by name: '${name}'!`);
  }

  const formatTree = formatters[name];

  return formatTree(tree);
};
