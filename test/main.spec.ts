import * as fs from 'fs';
import sortImports from 'import-sort';
import * as path from 'path';

const parser = path.resolve(__dirname, '../node_modules/import-sort-parser-typescript/lib/index.js');
const style = path.resolve(__dirname, '../src/index.ts');
const options = { prefixes: ['@lib', '@app'] };

describe('Within blocks', () => {
  describe('of side effect imports', () => {
    describe('with absolute paths to third-party modules', () => {
      it('are not sorted', () => {
        const unsortedCode = `
          import 'c';
          import 'a';
          import 'b';
        `;
        const sortedCode = executeSort(unsortedCode);
        exectImportsToBeEqual(sortedCode, unsortedCode);    
      });
    });

    describe('with absolute paths to local modules', () => {
      it('are not sorted', () => {
        const unsortedCode = `
          import '@lib/b2';
          import '@app/a1';
          import '@lib/b1';
        `;
        const sortedCode = executeSort(unsortedCode);
        exectImportsToBeEqual(sortedCode, unsortedCode);    
      });
    });

    describe('with relative paths', () => {
      it('are not sorted', () => {
        const unsortedCode = `
          import './c';
          import './a';
          import './b';
        `;
        const sortedCode = executeSort(unsortedCode);
        exectImportsToBeEqual(sortedCode, unsortedCode);    
      });
    });
  });

  describe('of regular imports', () => {
    describe('with absolute paths to native Node.js modules', () => {
      it('are sorted alphabetically', () => {
        const unsortedCode = `
          import * as path from 'path';
          import * as fs from 'fs';
          import * as http from 'http';
        `;
        const sortedCode = executeSort(unsortedCode);
        exectImportsToBeEqual(sortedCode, `
          import * as fs from 'fs';
          import * as http from 'http';
          import * as path from 'path';
        `);    
      });
    });

    describe('with absolute paths to third-party modules', () => {
      it('are sorted alphabetically', () => {
        const unsortedCode = `
          import cc from 'cc';
          import aa from 'aa';
          import bb from 'bb';
        `;
        const sortedCode = executeSort(unsortedCode);
        exectImportsToBeEqual(sortedCode, `
          import aa from 'aa';
          import bb from 'bb';
          import cc from 'cc';
        `);    
      });
    });

    describe('with absolute paths to local modules', () => {
      it('are sorted by prefix order and then alphabetically', () => {
        const unsortedCode = `
          import { a3 } from '@app/a3';
          import { a1 } from '@app/a1';
          import { b3 } from '@lib/b3';
          import { b1 } from '@lib/b1';
          import { b2 } from '@lib/b2';
          import { a2 } from '@app/a2';
        `;
        const sortedCode = executeSort(unsortedCode);
        exectImportsToBeEqual(sortedCode, `
          import { b1 } from '@lib/b1';
          import { b2 } from '@lib/b2';
          import { b3 } from '@lib/b3';
          import { a1 } from '@app/a1';
          import { a2 } from '@app/a2';
          import { a3 } from '@app/a3';
        `);
      });
    });

    describe('with relative paths', () => {
      it('are sorted by path and then alphabetically', () => {
        const unsortedCode = `
          import bbb from '../../bbb';
          import bbbb from '../bbbb';
          import aaaaa from './aaaaa';
          import bbbbb from './bbbbb';
          import aaaa from '../aaaa';
          import aaa from '../../aaa';
        `;
        const sortedCode = executeSort(unsortedCode);
        exectImportsToBeEqual(sortedCode, `
          import aaa from '../../aaa';
          import bbb from '../../bbb';
          import aaaa from '../aaaa';
          import bbbb from '../bbbb';
          import aaaaa from './aaaaa';
          import bbbbb from './bbbbb';
        `);    
      });
    });
  });
});

describe('Between blocks', () => {
    it('the correct order is applied', () => {
      const unsortedCode = `
        import z from 'z';
        import a from '@app/a';
        import * as fs from 'fs';
        import './a';
        import a from 'a';
        import '@app/a';
        import a from './a';
        import 'a';
      `;
      const sortedCode = executeSort(unsortedCode);
      exectImportsToBeEqual(sortedCode, `
        import 'a';
        import '@app/a';
        import './a';
        import a from 'a';
        import z from 'z';
        import * as fs from 'fs';
        import a from '@app/a';
        import a from './a';
      `);    
    });
});


function executeSort(unsortedCode: string): string {
  return sortImports(unsortedCode, parser, style, undefined, options).code;
}

function exectImportsToBeEqual(code1: string, code2: string) {
  const indentRegex = /\n */g;
  const trimmedCode1 = code1.replace(indentRegex, '\n').trim();
  const trimmedCode2 = code2.replace(indentRegex, '\n').trim();
  expect(trimmedCode1).toBe(trimmedCode2);
}
