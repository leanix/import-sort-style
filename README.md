# @leanix/import-sort-style

This [import-sort](https://github.com/renke/import-sort) is based on [import-sort-style-module](https://github.com/renke/import-sort/tree/master/packages/import-sort-style-module).

```js
// Absolute modules with side effects (not sorted because order may matter)
import 'a';
import 'c';
import 'b';

// Relative modules with side effects (not sorted because order may matter)
import './a';
import './c';
import './b';

// Third-party modules sorted by name
import aa from 'aa';
import bb from 'bb';
import cc from 'cc';
// Modules from the Node.js "standard" library sorted by name
import { readFile, writeFile } from 'fs';
import * as path from 'path';
// First-party modules sorted by "relative depth" and then by name
import aaa from '../../aaa';
import bbb from '../../bbb';
import aaaa from '../aaaa';
import bbbb from '../bbbb';
import aaaaa from './aaaaa';
import bbbbb from './bbbbb';
```
