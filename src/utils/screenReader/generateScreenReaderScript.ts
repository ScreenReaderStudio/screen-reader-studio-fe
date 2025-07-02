import { AccessibleElement } from '@/utils/ast/analyzeAccessibility';

export default function generateScreenReaderScript(elements: AccessibleElement[]): string[] {
  return elements.map((el) => {
    const { tag, text, props } = el;

    const name = props['aria-label'] || text || props['alt'] || '';

    if (/^h[1-6]$/.test(tag)) {
      const level = tag[1];
      return `헤딩 레벨 ${level}: "${name}"`;
    }

    if (['nav', 'main', 'header', 'footer', 'aside'].includes(tag)) {
      const label = props['aria-label'] ? ` (label: "${props['aria-label']}")` : '';
      return `랜드마크 영역: ${tag}${label}`;
    }

    if (tag === 'img') {
      return props['alt'] ? `이미지: "${props['alt']}"` : `이미지: (대체 텍스트 없음)`;
    }

    if (tag === 'a') {
      return `링크: "${name}"`;
    }

    if (tag === 'input') {
      const placeholder = props['placeholder'] ? ` (placeholder: "${props['placeholder']}")` : '';
      return `입력 필드: "${name}"${placeholder}`;
    }

    if (tag === 'button') {
      const state =
        props['aria-pressed'] !== undefined
          ? ` (상태: ${props['aria-pressed'] === 'true' ? '선택됨' : '선택되지 않음'})`
          : '';
      return `버튼: "${name}"${state}`;
    }

    return `${tag} 요소: "${name}"`;
  });
}
