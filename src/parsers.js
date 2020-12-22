import yaml from 'js-yaml';

const parsers = {
  yml: yaml.safeLoad,
  json: JSON.parse,
};

export default (data, format) => parsers[format](data);
