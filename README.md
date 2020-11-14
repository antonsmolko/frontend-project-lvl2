### Hexlet tests and linter status:
![Actions Status](/workflows/hexlet-check/badge.svg)

# Differense Calculator

> Gendiff command is for calculating and dispalying differences in two .json files.

[![asciicast](https://asciinema.org/a/9IiOi9mZ5cn7gsYvb7uOVKXJ6.svg)](https://asciinema.org/a/9IiOi9mZ5cn7gsYvb7uOVKXJ6)

## Getting started

### Used as a command

```sh
$ make install

$ make publish

$ sudo npm link
```

For example:

```sh
$ gendiff ./examples/json/file1.json ./examples/json/file2.json
```

```
{
  - follow: false
    host: hexlet.io
  - proxy: 123.234.53.22
  - timeout: 20
  + timeout: 50
    verbose: true
}
```
### Used as a package

```sh
$ npm install @hexlet/code
```

```
./app.js

import genDiff from '@hexlet/code';

const diff = genDiff(filepath1, filepath2);
console.log(diff);