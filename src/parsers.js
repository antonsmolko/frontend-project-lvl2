import yaml from 'js-yaml';

const parsers = {
  yml: (data) => yaml.safeLoad(data),
  json: (data) => JSON.parse(data),
};

export default (data, extension) => {
  const parse = parsers[extension];

  return parse(data);
};
