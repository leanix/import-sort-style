import { IImport } from 'import-sort-parser';
import { IStyleAPI, IStyleItem } from 'import-sort-style';

function isLeanIXAlias(importItem: IImport): boolean {
  return importItem.moduleName.startsWith('lx-');
}

function caseInsensitiveNaturalOrder(first: string, second: string): number {
  return first.toLocaleLowerCase().localeCompare(second.toLocaleLowerCase(), 'en');
}

export default function(styleApi: IStyleAPI): IStyleItem[] {
  const { alias, and, not, dotSegmentCount, hasNoMember, isAbsoluteModule, isNodeModule, isRelativeModule, moduleName } = styleApi;

  return [
    // Absolute side-effect import:
    // import "foo"
    { match: and(hasNoMember, isAbsoluteModule) },

    // Relative side-effect import:
    // import "./foo"
    { match: and(hasNoMember, isRelativeModule) },

    // Absolute imports:
    // import … from "rxjs";
    {
      match: and(isAbsoluteModule, not(isLeanIXAlias)),
      sort: moduleName(caseInsensitiveNaturalOrder),
      sortNamedMembers: alias(caseInsensitiveNaturalOrder)
    },

    // LeanIX imports:
    // import … from "lx-…";
    {
      match: and(isLeanIXAlias),
      sort: moduleName(caseInsensitiveNaturalOrder),
      sortNamedMembers: alias(caseInsensitiveNaturalOrder)
    },

    // Relative imports:
    // import … from "./foo";
    // import … from "../foo";
    {
      match: isRelativeModule,
      sort: [dotSegmentCount, moduleName(caseInsensitiveNaturalOrder)],
      sortNamedMembers: alias(caseInsensitiveNaturalOrder)
    }
  ];
}
