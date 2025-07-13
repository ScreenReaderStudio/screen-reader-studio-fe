'use client';

import { useRef } from 'react';

import IssuesList from '@/components/ResultViewer/IssuesList';
import Placeholder from '@/components/ResultViewer/Placeholder';
import ScreenReaderScript from '@/components/ResultViewer/ScreenReaderScript';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { useAnalysisStore } from '@/stores/useAnalysisStore';

export default function ResultViewer() {
  const { isLoading, analysisResult, pageContent } = useAnalysisStore();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const postHighlightMessage = (selector: string) => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: 'highlight', selector }, '*');
    }
  };

  const handleHighlightAndSpeak = (selector: string, textToSpeak: string) => {
    postHighlightMessage(selector);
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    window.speechSynthesis.speak(utterance);
  };

  const handleHighlightOnly = (selector: string) => {
    postHighlightMessage(selector);
    window.speechSynthesis.cancel();
  };

  if (isLoading && !analysisResult) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p>분석 중입니다. 잠시만 기다려주세요...</p>
      </div>
    );
  }

  if (!analysisResult) {
    return <Placeholder />;
  }

  return (
    <div className="flex h-[60vh] w-full gap-4">
      <div className="flex-1 rounded-md border border-gray-300 p-0.5">
        {pageContent ? (
          <iframe
            ref={iframeRef}
            srcDoc={pageContent}
            title="분석 결과 화면"
            className="h-full w-full border-0"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            콘텐츠를 불러올 수 없습니다.
          </div>
        )}
      </div>

      <div className="w-1/3 overflow-y-auto rounded-md border border-gray-300 p-4">
        <Tabs defaultValue="script" className="w-full">
          <TabsList className="mb-2 grid w-full grid-cols-2">
            <TabsTrigger value="script">스크린 리더 대본</TabsTrigger>
            <TabsTrigger value="issues">접근성 이슈</TabsTrigger>
          </TabsList>

          <TabsContent value="script">
            <ScreenReaderScript onScriptItemClick={handleHighlightAndSpeak} />
          </TabsContent>
          <TabsContent value="issues">
            <IssuesList onNodeClick={handleHighlightOnly} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
