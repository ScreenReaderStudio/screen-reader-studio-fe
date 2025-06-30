import * as t from '@babel/types';

export default function extractTextFromChildren(
  children: (
    | t.JSXText
    | t.JSXExpressionContainer
    | t.JSXSpreadChild
    | t.JSXElement
    | t.JSXFragment
  )[]
): string {
  return children
    .map((child) => {
      if (t.isJSXText(child)) {
        return child.value.trim();
      } else if (t.isJSXExpressionContainer(child) && t.isStringLiteral(child.expression)) {
        return child.expression.value;
      }
      return '';
    })
    .join('');
}
