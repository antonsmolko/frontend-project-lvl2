import yaml from 'js-yaml';

const parsers = {
  yml: yaml.safeLoad,
  json: JSON.parse,
};

export default (data, extension) => {
  const parse = parsers[extension];

  return parse(data);
};
