import { create } from 'zustand';

import type { AxeResults } from 'axe-core';

export interface ScreenReaderScriptItem {
  text: string;
  selector: string;
}

interface AnalysisState {
  analysisResult: AxeResults | null;
  screenReaderScript: ScreenReaderScriptItem[] | null;
  pageContent: string | null;
  isLoading: boolean;
  error: string | null;
  selectedScreenReader: 'voiceover' | 'nvda';
  setSelectedScreenReader: (reader: 'voiceover' | 'nvda') => void;
  analyze: (options: { url?: string; htmlContent?: string }) => Promise<void>;
  setAnalysisData: (data: {
    analysisResult: AxeResults | null;
    screenReaderScript: ScreenReaderScriptItem[] | null;
    pageContent: string | null;
    selectedScreenReader: 'voiceover' | 'nvda';
  }) => void;
}

export const useAnalysisStore = create<AnalysisState>((set) => ({
  analysisResult: null,
  screenReaderScript: null,
  pageContent: null,
  isLoading: false,
  error: null,
  selectedScreenReader: 'voiceover',

  setSelectedScreenReader: (reader) => set({ selectedScreenReader: reader }),

  setAnalysisData: ({ analysisResult, screenReaderScript, pageContent, selectedScreenReader }) =>
    set({
      analysisResult,
      screenReaderScript,
      pageContent,
      selectedScreenReader,
      isLoading: false,
      error: null,
    }),

  analyze: async ({ url, htmlContent }) => {
    const { selectedScreenReader } = useAnalysisStore.getState();
    set({
      isLoading: true,
      error: null,
      analysisResult: null,
      screenReaderScript: null,
      pageContent: null,
    });

    try {
      const response = await fetch('http://localhost:8080/api/analysis/perform', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, htmlContent, screenReader: selectedScreenReader }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '분석에 실패했습니다.');
      }

      const { accessibilityAnalysis, screenReaderScript, pageContent } = await response.json();
      set({
        analysisResult: accessibilityAnalysis,
        screenReaderScript,
        pageContent,
        isLoading: false,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      set({ error: message, isLoading: false });
    }
  },
}));
