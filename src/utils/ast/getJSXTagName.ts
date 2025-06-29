import * as t from '@babel/types';

export default function getJSXTagName(nameNode: t.JSXIdentifier | t.JSXMemberExpression): string {
  if (t.isJSXIdentifier(nameNode)) {
    return nameNode.name;
  }
  if (t.isJSXMemberExpression(nameNode)) {
    return `${getJSXTagName(nameNode.object)}.${nameNode.property.name}`;
  }

  return 'Unknown';
}
