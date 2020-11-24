import commander from 'commander';
import genDif from './gendiff.js';

const { program } = commander;

program
  .version('1.0.0')
  .description('Compares two configuration files and shows a difference.')
  .arguments('<filepath1> <filepath2>')
  .option('-f, --format [type]', 'output format')
  .action(async (filepath1, filepath2) => {
    const diff = await genDif(filepath1, filepath2, program.format);
    console.log(diff);
  });

export default () => program.parse(process.argv);
