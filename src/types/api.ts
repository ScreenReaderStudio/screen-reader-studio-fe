/**
 * API 관련 타입 정의
 */

export interface ApiResponse<T = unknown> {
  data?: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

export interface User {
  userId: string;
  email?: string;
  name?: string;
}

export interface AnalysisRequest {
  url?: string;
  htmlContent?: string;
  screenReader: ScreenReaderType;
}

export interface AnalysisResponse {
  accessibilityAnalysis: AxeResults;
  screenReaderScript: ScreenReaderScriptItem[];
  pageContent: string;
}

export interface SaveAnalysisRequest {
  pageContent: string;
  accessibilityAnalysis: AxeResults;
  screenReaderScript: ScreenReaderScriptItem[];
  selectedScreenReader: ScreenReaderType;
}

export interface SaveAnalysisResponse {
  id: string;
  shareableLink: string;
}

export type ScreenReaderType = 'voiceover' | 'nvda';

export interface ScreenReaderScriptItem {
  text: string;
  selector: string;
}

export type AxeResults = import('axe-core').AxeResults;
