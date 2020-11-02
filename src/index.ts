import { IImport } from 'import-sort-parser';
import { IStyleAPI, IStyleItem } from 'import-sort-style';

interface StyleOptions {
  prefixes?: string[];
}

function isAbsoluteLocalPath(importItem: IImport, options?: StyleOptions): boolean {
  if (options?.prefixes) {
    return options.prefixes.some(prefix => importItem.moduleName.startsWith(prefix));
  }
  return false;
}

function absoluteLocalPathSorting(module1: string, module2: string, options?: StyleOptions): number {
  if (options?.prefixes) {
    const index1 = options.prefixes.findIndex(prefix => module1.startsWith(prefix));
    const index2 = options.prefixes.findIndex(prefix => module2.startsWith(prefix));
    return index1 === index2 ? caseInsensitiveNaturalOrder(module1, module2) : index1 - index2;
  }
  return caseInsensitiveNaturalOrder(module1, module2);
}

function caseInsensitiveNaturalOrder(first: string, second: string): number {
  return first.toLocaleLowerCase().localeCompare(second.toLocaleLowerCase(), 'en');
}

export default function(styleApi: IStyleAPI, _file: string, options?: StyleOptions): IStyleItem[] {
  const { alias, and, not, dotSegmentCount, hasNoMember, isAbsoluteModule, isNodeModule, isRelativeModule, moduleName } = styleApi;

  return [
    // Third-party modules with side effects
    { match: and(hasNoMember, isAbsoluteModule, (importItem) => !isAbsoluteLocalPath(importItem, options)) },

    // Local, absolute modules with side-effects
    { match: and(hasNoMember, isAbsoluteModule) },

    // Local, relative modules with side effects
    { match: and(hasNoMember, isRelativeModule) },

    // Third-party modules
    {
      match: and(isAbsoluteModule, not(isNodeModule), (importItem) => !isAbsoluteLocalPath(importItem, options)),
      sort: moduleName(caseInsensitiveNaturalOrder),
      sortNamedMembers: alias(caseInsensitiveNaturalOrder)
    },

    // Built-in Node.js modules)
    {
      match: and(isAbsoluteModule, isNodeModule, (importItem) => !isAbsoluteLocalPath(importItem, options)),
      sort: moduleName(caseInsensitiveNaturalOrder),
      sortNamedMembers: alias(caseInsensitiveNaturalOrder)
    },

    // Local, absolute modules
    {
      match: (importItem) => isAbsoluteLocalPath(importItem, options),
      sort: moduleName((m1: string, m2: string) => absoluteLocalPathSorting(m1, m2, options)),
      sortNamedMembers: alias(caseInsensitiveNaturalOrder)
    },

    // Local, relative modules
    {
      match: isRelativeModule,
      sort: [dotSegmentCount, moduleName(caseInsensitiveNaturalOrder)],
      sortNamedMembers: alias(caseInsensitiveNaturalOrder)
    }
  ];
}
