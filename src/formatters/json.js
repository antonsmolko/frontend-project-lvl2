import parse from '../parser.js';

export default (data1, data2) => {
  const parsedData = parse(data1, data2);

  return JSON.stringify(parsedData);
};
