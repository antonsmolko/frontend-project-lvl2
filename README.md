### Hexlet tests and linter status:
![Actions Status](/workflows/hexlet-check/badge.svg)

[![Maintainability](https://api.codeclimate.com/v1/badges/791ad1d4d9bd27f68d5c/maintainability)](https://codeclimate.com/github/antonsmolko/frontend-project-lvl2/maintainability)

[![Test Coverage](https://api.codeclimate.com/v1/badges/791ad1d4d9bd27f68d5c/test_coverage)](https://codeclimate.com/github/antonsmolko/frontend-project-lvl2/test_coverage)

# Differense Calculator

> Gendiff command is for calculating and dispalying differences in two .json or .yml files

## Getting started

### Used as a command

```sh
$ make install

$ make publish

$ sudo npm link
```

### Example with .json files:

[![asciicast](https://asciinema.org/a/rPBLecN3b9Rxl7O3DpFdl9WkT.svg)](https://asciinema.org/a/rPBLecN3b9Rxl7O3DpFdl9WkT)

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

[![asciicast](https://asciinema.org/a/AGb0OlDNzhee9zzeXKDqGfgvh.svg)](https://asciinema.org/a/AGb0OlDNzhee9zzeXKDqGfgvh)

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

### Example with plain format:

[![asciicast](https://asciinema.org/a/8dWqdNuV3W5mgmVAT2rlbNflV.svg)](https://asciinema.org/a/8dWqdNuV3W5mgmVAT2rlbNflV)

```
./examples/file1.json

{
  "common": {
    "setting1": "Value 1",
    "setting2": 200,
    "setting3": true,
    "setting6": {
      "key": "value",
      "doge": {
        "wow": ""
      }
    }
  },
  "group1": {
    "baz": "bas",
    "foo": "bar",
    "nest": {
      "key": "value"
    }
  },
  "group2": {
    "abc": 12345,
    "deep": {
      "id": 45
    }
  }
}
```
```
./examples/file2.json

{
  "common": {
    "follow": false,
    "setting1": "Value 1",
    "setting3": null,
    "setting4": "blah blah",
    "setting5": {
      "key5": "value5"
    },
    "setting6": {
      "key": "value",
      "ops": "vops",
      "doge": {
        "wow": "so much"
      }
    }
  },
  "group1": {
    "foo": "bar",
    "baz": "bars",
    "nest": "str"
  },
  "group3": {
    "fee": 100500,
    "deep": {
      "id": {
        "number": 45
      }
    }
  }
}
```
```sh
$ gendiff --format plain ./examples/file1.json ./examples/file2.json
```
```
Property 'common.follow' was added with value: false
Property 'common.setting2' was removed
Property 'common.setting3' was updated. From true to null
Property 'common.setting4' was added with value: 'blah blah'
Property 'common.setting5' was added with value: [complex value]
Property 'common.setting6.doge.wow' was updated. From '' to 'so much'
Property 'common.setting6.ops' was added with value: 'vops'
Property 'group1.baz' was updated. From 'bas' to 'bars'
Property 'group1.nest' was updated. From [complex value] to 'str'
Property 'group2' was removed
Property 'group3' was added with value: [complex value]
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
```

### Used as a package with plain format
```
./app.js

import genDiff from '@hexlet/code';

const diff = genDiff(filepath1, filepath2, 'plain');
console.log(diff);
```