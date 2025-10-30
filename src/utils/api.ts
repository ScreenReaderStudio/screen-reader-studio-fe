export class ApiError extends Error {
  public status: number;
  public code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

export async function apiRequest<T = unknown>(url: string, options: RequestInit = {}): Promise<T> {
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  };

  const response = await fetch(url, { ...defaultOptions, ...options });

  if (!response.ok) {
    let errorData: { message?: string; code?: string } = {};

    try {
      errorData = await response.json();
    } catch {}

    throw new ApiError(
      errorData.message || `요청이 실패했습니다. (상태: ${response.status})`,
      response.status,
      errorData.code
    );
  }

  return response.json();
}

export function getApiUrl(endpoint: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  if (!baseUrl) {
    throw new Error('NEXT_PUBLIC_BACKEND_API_URL 환경 변수가 설정되지 않았습니다.');
  }
  return `${baseUrl}${endpoint}`;
}

export function handleApiError(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return '알 수 없는 오류가 발생했습니다.';
}
