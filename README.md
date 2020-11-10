# @leanix/import-sort-style

This [import-sort](https://github.com/renke/import-sort) is based on [import-sort-style-module](https://github.com/renke/import-sort/tree/master/packages/import-sort-style-module).

## Installation

- Install with `npm i -D @leanix/import-sort-style`
- If used with Prettier, install `npm i -D prettier-plugin-import-sort@0.0.3` for Prettier@v1 and `npm i -D prettier-plugin-import-sort` for Prettier@v2

## Configuration

- Add a configuration like the following to your package.json to specify the parser (which may need to be installed separately) and the corresponding extensions:

```
"importSort": {
  ".js, .ts": {
    "style": "@leanix/import-sort-style",
    "parser": "typescript",
    "options": {
      "prefixes": [
        "@app",
        "@lib"
      ]
    }
  }
}
```
- The list of local prefixes/aliases is optional. 

## Sort order

The order of imports is:

1. Third-party modules with side effects are not sorted because order may matter, e.g. `import 'polyfills';`
2. Local, absolute modules with side-effects are not sorted because order may matter, e.g. `import '@app/polyfills';`
3. Local, relative modules with side effects are not sorted because order may matter, e.g. `import './polyfills';`
4. Third-party modules are sorted by name, e.g. `import { endOfMonth } from 'date-fns';`
5. Built-in Node.js modules are sorted by name, e.g. `import * as fs from 'fs';`
6. Local, absolute modules are sorted by the prefix-order provided and then by name `import { LIMIT } from '@app/app.constants';`
7. Local, relative modules are sorted by "relative depth" and then by name `import { LIMIT } from './app.constants';`

See the [tests](./test/main.spec.ts) for more examples.

## Copyright and license

Copyright 2020 LeanIX GmbH under the [Unlicense license](LICENSE).
