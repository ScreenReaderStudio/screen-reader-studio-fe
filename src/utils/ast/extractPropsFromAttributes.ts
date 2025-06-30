import * as t from '@babel/types';

export default function extractPropsFromAttributes(
  attributes: (t.JSXAttribute | t.JSXSpreadAttribute)[]
): Record<string, string | number | boolean> {
  const props: Record<string, string | number | boolean> = {};

  attributes.forEach((attr) => {
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

  return props;
}
