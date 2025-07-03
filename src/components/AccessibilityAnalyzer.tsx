'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';

import TabsContextProvider from '@/components/TabsContextProvider';
import Button from '@/components/ui/Button';
import { TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { useTabsContext } from '@/components/ui/Tabs/context';
import { useInputStore } from '@/stores/useInputStore';
import { useResultStore } from '@/stores/useResultStore';
import detectAccessibilityWarnings from '@/utils/accessibility/detectAccessibilityWarnings';
import formatAccessibilityIssueResult from '@/utils/accessibility/formatAccessibilityIssueResult';
import analyzeAccessibility from '@/utils/ast/analyzeAccessibility';
import formatScreenReaderScriptResult from '@/utils/screenReader/formatScreenReaderScriptResult';
import generateScreenReaderScript from '@/utils/screenReader/generateScreenReaderScript';

const CodeEditor = dynamic(() => import('@/components/CodeEditor'), {
  ssr: false,
});

function AccessibilityAnalyzerContent() {
  const { selectedTab } = useTabsContext();
  const code = useInputStore((state) => state.code);
  const url = useInputStore((state) => state.url);
  const setUrl = useInputStore((state) => state.setUrl);
  const setResult = useResultStore((state) => state.setResult);

  async function runAccessibilityAnalysis() {
    try {
      if (selectedTab === 'code') {
        const extracted = analyzeAccessibility(code);
        const rawScript = generateScreenReaderScript(extracted);
        const script = formatScreenReaderScriptResult(rawScript);
        const rawWarnings = detectAccessibilityWarnings(extracted);
        const warnings = formatAccessibilityIssueResult(rawWarnings);

        setResult({ script, warnings });
      } else if (selectedTab === 'url') {
        if (!url) {
          alert('URL을 입력해주세요.');
          return;
        }

        const res = await fetch(`/api/fetch-html?url=${encodeURIComponent(url)}`);
        const { script, warnings } = await res.json();

        setResult({ script, warnings });
      }
    } catch (err) {
      console.error('분석 실패:', err);
    }
  }

  return (
    <>
      <div className="mb-2 flex gap-2">
        <Button className="h-10 w-full bg-black text-white" onClick={runAccessibilityAnalysis}>
          분석
        </Button>
      </div>
      <TabsList className="mb-2 grid w-full grid-cols-2">
        <TabsTrigger value="code">
          <Image
            src="/code.svg"
            alt="코드 아이콘"
            width={16}
            height={16}
            priority
            className="mr-2"
          />
          코드
        </TabsTrigger>
        <TabsTrigger value="url">
          <Image
            src="/globe.svg"
            alt="URL 아이콘"
            width={16}
            height={16}
            priority
            className="mr-2"
          />
          URL
        </TabsTrigger>
      </TabsList>

      <TabsContent value="code">
        <CodeEditor />
      </TabsContent>

      <TabsContent value="url">
        <input
          className="border-input bg-background ring-offset-background file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring mb-2 flex h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <div className="rounded-md bg-blue-100 p-4 font-medium text-blue-800">
          <div className="flex items-start gap-3">
            <div>
              <p className="mb-1 font-medium">URL 분석 안내</p>
              <ul className="space-y-1 text-xs">
                <li>• 분석 사이트가 React를 사용하는 경우 iframe을 허용해야 사용할 수 있습니다</li>
                <li>• 분석에는 몇 초가 소요될 수 있습니다</li>
              </ul>
            </div>
          </div>
        </div>
      </TabsContent>
    </>
  );
}

export default function AccessibilityAnalyzer() {
  return (
    <TabsContextProvider className="w-full" defaultValue="code">
      <AccessibilityAnalyzerContent />
    </TabsContextProvider>
  );
}
