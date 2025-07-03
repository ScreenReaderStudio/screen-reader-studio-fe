import { JSDOM } from 'jsdom';

import type { AccessibleElement } from '@/utils/ast/analyzeAccessibility';

export default function analyzeHTMLWithJsdom(html: string): AccessibleElement[] {
  try {
    const dom = new JSDOM(html, {
      runScripts: 'outside-only',
      resources: 'usable',
      pretendToBeVisual: false,
    });
    const document = dom.window.document.body;

    if (!document) {
      return [];
    }

    const elements: AccessibleElement[] = [];
    document.querySelectorAll('*').forEach((element) => {
      const tag = element.tagName.toLowerCase();
      const text = element.textContent?.trim() || '';
      const props: Record<string, string | boolean | number> = {};
      for (const attr of element.attributes) {
        props[attr.name] = attr.value;
      }
      elements.push({ tag, text, props });
    });

    return elements;
  } catch (error) {
    console.error('Error parsing HTML with JSDOM:', error);
    return [];
  }
}
