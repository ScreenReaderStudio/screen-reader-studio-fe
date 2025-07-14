'use client';

import { useRef, useMemo, useEffect, useState } from 'react';

import IssuesList from '@/components/ResultViewer/IssuesList';
import Placeholder from '@/components/ResultViewer/Placeholder';
import ScreenReaderScript from '@/components/ResultViewer/ScreenReaderScript';
import Button from '@/components/ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useAnalysisStore } from '@/stores/useAnalysisStore';

export default function ResultViewer({ showShareButton = true }: { showShareButton?: boolean }) {
  const { isLoading, analysisResult, pageContent, screenReaderScript, selectedScreenReader } =
    useAnalysisStore();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [shareableLink, setShareableLink] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const { isLoggedIn } = useAuth();

  const iframeSrc = useMemo(() => {
    if (!pageContent) {
      return undefined;
    }

    const blob = new Blob([pageContent], { type: 'text/html' });

    return URL.createObjectURL(blob);
  }, [pageContent]);

  useEffect(() => {
    return () => {
      if (iframeSrc) {
        URL.revokeObjectURL(iframeSrc);
      }
    };
  }, [iframeSrc]);

  async function handleSaveResult() {
    if (!analysisResult || !pageContent || !screenReaderScript) {
      console.error('Save failed: Missing analysisResult, pageContent, or screenReaderScript', {
        analysisResult: !!analysisResult,
        pageContent: !!pageContent,
        screenReaderScript: !!screenReaderScript,
      });
      alert('분석할 URL 또는 HTML 콘텐츠가 없습니다. 먼저 분석을 수행해주세요.');
      return;
    }

    setIsSaving(true);
    setShareableLink('');
    setIsSaved(false);

    console.log('Attempting to save analysis with data:', {
      pageContent: pageContent ? '[Content Exists]' : '[No Content]',
      accessibilityAnalysis: analysisResult ? '[Analysis Exists]' : '[No Analysis]',
      screenReaderScript: screenReaderScript ? '[Script Exists]' : '[No Script]',
      selectedScreenReader: selectedScreenReader,
    });

    try {
      const response = await fetch('http://localhost:8080/api/analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pageContent,
          accessibilityAnalysis: analysisResult,
          screenReaderScript,
          selectedScreenReader,
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `결과 저장에 실패했습니다. (상태: ${response.status})`
        );
      }

      const { id } = await response.json();
      const link = `${window.location.origin}/analysis/${id}`;
      setShareableLink(link);
      setIsSaved(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      console.error('Failed to save analysis:', error);
      alert(message);
    } finally {
      setIsSaving(false);
    }
  }

  function handleCopyLink() {
    if (!shareableLink) {
      return;
    }
    navigator.clipboard.writeText(shareableLink);
    alert('공유 링크가 클립보드에 복사되었습니다.');
  }

  function postHighlightMessage(selector: string) {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: 'highlight', selector },
        window.location.origin
      );
    }
  }

  function handleHighlightAndSpeak(selector: string, textToSpeak: string) {
    postHighlightMessage(selector);
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    window.speechSynthesis.speak(utterance);
  }

  function handleHighlightOnly(selector: string) {
    postHighlightMessage(selector);
    window.speechSynthesis.cancel();
  }

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
        {iframeSrc ? (
          <iframe
            ref={iframeRef}
            src={iframeSrc}
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
        {showShareButton && isLoggedIn && analysisResult && (
          <div className="mb-4 space-y-2">
            {!isSaved ? (
              <Button
                onClick={handleSaveResult}
                disabled={isSaving}
                className="w-full rounded-md px-4 py-2 text-white disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {isSaving ? '생성 중...' : '공유 링크 생성'}
              </Button>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={shareableLink}
                    readOnly
                    className="flex-grow rounded-md border border-gray-300 bg-gray-100 p-2 text-sm"
                  />
                  <Button onClick={handleCopyLink} className="w-20 rounded-md px-3 py-2 text-sm">
                    링크 복사
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
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
