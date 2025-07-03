import { JSDOM } from 'jsdom';

import type { AccessibleElement } from '@/utils/ast/analyzeAccessibility';

export default function analyzeHTMLWithJsdom(html: string): AccessibleElement[] {
  const dom = new JSDOM(html);
  const document = dom.window.document.body;

  const elements: AccessibleElement[] = [];

  document.querySelectorAll('*').forEach((el) => {
    const tag = el.tagName.toLowerCase();
    const text = el.textContent?.trim() || '';
    const props: Record<string, string | boolean | number> = {};

    for (const attr of el.attributes) {
      props[attr.name] = attr.value;
    }

    elements.push({ tag, text, props });
  });

  return elements;
}
