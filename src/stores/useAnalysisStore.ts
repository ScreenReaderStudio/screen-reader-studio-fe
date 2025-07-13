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
}

export const useAnalysisStore = create<AnalysisState>((set) => ({
  analysisResult: null,
  screenReaderScript: null,
  pageContent: null,
  isLoading: false,
  error: null,
  selectedScreenReader: 'voiceover',

  setSelectedScreenReader: (reader) => set({ selectedScreenReader: reader }),

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
      const response = await fetch('/api/analysis', {
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
