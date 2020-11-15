### Hexlet tests and linter status:
![Actions Status](/workflows/hexlet-check/badge.svg)

[![Maintainability](https://api.codeclimate.com/v1/badges/791ad1d4d9bd27f68d5c/maintainability)](https://codeclimate.com/github/antonsmolko/frontend-project-lvl2/maintainability)

[![Test Coverage](https://api.codeclimate.com/v1/badges/791ad1d4d9bd27f68d5c/test_coverage)](https://codeclimate.com/github/antonsmolko/frontend-project-lvl2/test_coverage)

# Differense Calculator

> Gendiff command is for calculating and dispalying differences in two .json files.

## Getting started

### Used as a command

```sh
$ make install

$ make publish

$ sudo npm link
```

### Example with .json files:

[![asciicast](https://asciinema.org/a/vlvl9iGJmJfgebV5bOqVjNmZp.svg)](https://asciinema.org/a/vlvl9iGJmJfgebV5bOqVjNmZp)

```
./examples/file1.json

{
  "host": "hexlet.io",
  "timeout": 50,
  "proxy": "123.234.53.22",
  "follow": false
}
```
```
./examples/file2.json

{
  "timeout": 20,
  "verbose": true,
  "host": "hexlet.io"
}
```
```sh
$ gendiff ./examples/file1.json ./examples/file2.json
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
### Example with .yml files:

[![asciicast](https://asciinema.org/a/P2bANtLmXXdXP61andy63hlMQ.svg)](https://asciinema.org/a/P2bANtLmXXdXP61andy63hlMQ)

```
./examples/file1.yml

---
  host: 'hexlet.io'
  timeout: 50
  proxy: '123.234.53.22'
  follow: false
```
```
./examples/file2.yml

---
  timeout: 20
  verbose: true
  host: 'hexlet.io'
```
```sh
$ gendiff ./examples/file1.yml ./examples/file2.yml
```

```
{
  + paramFive: 1,2
    paramFour: 234
    paramOne: true
    paramThree: 123
  - paramTwo: false
  + paramTwo: true
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