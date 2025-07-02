'use client';

import dynamic from 'next/dynamic';

import Button from '@/components/ui/Button';
import { useCodeStore } from '@/stores/useCodeStore';
import { useResultStore } from '@/stores/useResultStore';
import detectAccessibilityWarnings from '@/utils/accessibility/detectAccessibilityWarnings';
import formatAccessibilityIssueResult from '@/utils/accessibility/formatAccessibilityIssueResult';
import analyzeAccessibility from '@/utils/ast/analyzeAccessibility';
import formatScreenReaderScriptResult from '@/utils/screenReader/formatScreenReaderScriptResult';
import generateScreenReaderScript from '@/utils/screenReader/generateScreenReaderScript';

const CodeEditor = dynamic(() => import('@/components/CodeEditor'), {
  ssr: false,
});

export default function AccessibilityAnalyzer() {
  const code = useCodeStore((state) => state.code);
  const setResult = useResultStore((state) => state.setResult);

  async function runAccessibilityAnalysis() {
    try {
      const extracted = analyzeAccessibility(code);

      const rawScript = generateScreenReaderScript(extracted);
      const script = formatScreenReaderScriptResult(rawScript);

      const rawWarnings = detectAccessibilityWarnings(extracted);
      const warnings = formatAccessibilityIssueResult(rawWarnings);

      setResult({ script, warnings });
    } catch (err) {
      console.error('분석 실패:', err);
    }
  }

  return (
    <>
      <div className="mb-4 flex gap-2">
        <Button className="h-10 w-full bg-black text-white" onClick={runAccessibilityAnalysis}>
          분석
        </Button>
      </div>
      <CodeEditor />
    </>
  );
}
