import _ from 'lodash';
import stylish from './stylish.js';
import plain from './plain.js';

const formatters = {
  stylish,
  plain,
  json: (tree) => JSON.stringify(tree),
};

export default (tree, formatter) => {
  if (!_.has(formatters, formatter)) {
    throw new Error(`Unknown formatter: '${formatter}'!`);
  }

  const formatTree = formatters[formatter];

  return formatTree(tree);
};
