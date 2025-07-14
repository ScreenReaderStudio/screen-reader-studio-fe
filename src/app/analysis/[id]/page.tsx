'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import Header from '@/components/Header';
import ResultViewer from '@/components/ResultViewer';
import { screenReader } from '@/constants/screenReader';
import { useAnalysisStore } from '@/stores/useAnalysisStore';

export default function SharedAnalysisPage() {
  const { id } = useParams();
  const { analysisResult, setAnalysisData, selectedScreenReader } = useAnalysisStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      return;
    }

    async function fetchAnalysis() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/analysis/${id}`);

        if (!response.ok) {
          throw new Error('분석 결과를 불러오는데 실패했습니다.');
        }

        const data = await response.json();
        setAnalysisData({
          analysisResult: data.accessibilityAnalysis,
          screenReaderScript: data.screenReaderScript,
          pageContent: data.pageContent,
          selectedScreenReader: data.selectedScreenReader,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchAnalysis();
  }, [id, setAnalysisData]);

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">결과를 불러오는 중...</div>;
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500">오류: {error}</div>
    );
  }

  return (
    <>
      <Header />
      <div className="p-6">
        <h1 className="mb-3 text-2xl font-bold">접근성 분석 리포트</h1>
        <p className="mb-3 text-gray-600">
          {analysisResult?.url}의 접근성 분석 결과입니다. 스크린 리더 대본을 생성할 때{' '}
          {screenReader[selectedScreenReader]}를 기준으로 생성되었습니다.
        </p>
        <ResultViewer showShareButton={false} />
      </div>
    </>
  );
}
