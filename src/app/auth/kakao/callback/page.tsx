'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useAuth } from '@/contexts/AuthContext';

export default function KakaoCallback() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login } = useAuth();

  useEffect(() => {
    const code = searchParams.get('code');

    if (code) {
      async function sendCodeToBackend() {
        try {
          const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

          const response = await fetch(`${backendUrl}/api/auth/kakao`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code }),
            credentials: 'include',
          });

          if (response.ok) {
            const { user } = await response.json();
            login(user);
            router.replace('/');
          } else {
            const errorData = await response.json();
            throw new Error(errorData.message || '서버에서 오류가 발생했습니다.');
          }
        } catch (error) {
          console.error('카카오 로그인 처리 실패:', error);
          alert('로그인에 실패했습니다. 다시 시도해주세요.');
          router.replace('/login');
        }
      }

      sendCodeToBackend();
    } else {
      alert('비정상적인 접근입니다.');
      router.replace('/login');
    }
  }, [searchParams, router, login]);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <p>카카오 로그인 처리 중입니다. 잠시만 기다려주세요...</p>
    </div>
  );
}
