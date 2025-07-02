import { AccessibleElement } from '@/utils/ast/analyzeAccessibility';

export default function detectAccessibilityWarnings(elements: AccessibleElement[]): string[] {
  const warnings: string[] = [];

  elements.forEach((el, idx) => {
    const { tag, props, text } = el;

    if (tag === 'img' && !('alt' in props)) {
      warnings.push(`[${tag}] ${idx + 1}번째 태그인 img에 alt 속성이 없습니다.`);
    }

    if (tag === 'input') {
      const hasLabel = elements.some(
        (e) => e.tag === 'label' && e.props['htmlFor'] === props['id']
      );
      if (!hasLabel) {
        warnings.push(
          `[${tag}] "${props.id || '이름 없음'}" 입력 필드에 연결된 <label>이 없습니다.`
        );
      }
    }

    if (tag === 'button' && !text && !props['aria-label']) {
      warnings.push(`[${tag}] 버튼에 텍스트나 aria-label이 없습니다.`);
    }

    if (tag === 'a' && !props['href']) {
      warnings.push(`[${tag}] 링크에 href 속성이 없습니다.`);
    }
  });

  return warnings;
}
