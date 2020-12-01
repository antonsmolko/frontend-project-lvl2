import yaml from 'js-yaml';

export default {
  yml: (data) => yaml.safeLoad(data),
  json: (data) => JSON.parse(data),
};
