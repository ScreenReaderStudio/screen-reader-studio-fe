import { parse } from '@babel/parser';
import traverse, { NodePath } from '@babel/traverse';
import * as t from '@babel/types';

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

      const tag = getJSXTagName(openingEl.name);

      let text = '';
      path.node.children.forEach((child) => {
        if (t.isJSXText(child)) {
          text += child.value.trim();
        } else if (t.isJSXExpressionContainer(child) && t.isStringLiteral(child.expression)) {
          text += child.expression.value;
        }
      });

      const props: Record<string, string | number | boolean> = {};
      openingEl.attributes.forEach((attr) => {
        if (t.isJSXAttribute(attr) && t.isJSXIdentifier(attr.name)) {
          const key = attr.name.name;
          const valueNode = attr.value;

          if (t.isStringLiteral(valueNode)) {
            props[key] = valueNode.value;
          } else if (t.isJSXExpressionContainer(valueNode) && valueNode.expression) {
            const expr = valueNode.expression;
            if (t.isStringLiteral(expr)) {
              props[key] = expr.value;
            } else if (t.isNumericLiteral(expr)) {
              props[key] = expr.value;
            } else if (t.isBooleanLiteral(expr)) {
              props[key] = expr.value;
            }
          }
        }
      });

      results.push({
        tag,
        text,
        props,
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
