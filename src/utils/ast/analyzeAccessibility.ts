import { parse } from '@babel/parser';
import traverse, { NodePath } from '@babel/traverse';
import * as t from '@babel/types';

import extractPropsFromAttributes from '@/utils/ast/extractPropsFromAttributes';
import extractTextFromChildren from '@/utils/ast/extractTextFromChildren';
import getJSXTagName from '@/utils/ast/getJSXTagName';

export interface AccessibleElement {
  tag: string;
  text: string;
  props: Record<string, string | number | boolean>;
  loc?: { start: number; end: number };
}

export default function analyzeAccessibility(code: string): AccessibleElement[] {
  const results: AccessibleElement[] = [];

  let ast: t.File;
  try {
    ast = parse(code, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript'],
    });
  } catch (error) {
    console.warn('Failed to parse code:', error);
    return [];
  }

  traverse(ast, {
    JSXElement(path: NodePath<t.JSXElement>) {
      const openingEl = path.node.openingElement;

      if (!t.isJSXIdentifier(openingEl.name) && !t.isJSXMemberExpression(openingEl.name)) {
        return;
      }

      results.push({
        tag: getJSXTagName(openingEl.name),
        text: extractTextFromChildren(path.node.children),
        props: extractPropsFromAttributes(openingEl.attributes),
        loc: path.node.loc
          ? {
              start: path.node.loc.start.line,
              end: path.node.loc.end.line,
            }
          : undefined,
      });
    },
  });

  return results;
}
