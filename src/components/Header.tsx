'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

import Button from '@/components/ui/Button';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function checkLoginStatus() {
      try {
        const response = await fetch('/api/users/me');

        if (response.ok) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('로그인 상태 확인 중 에러 발생', error);

        setIsLoggedIn(false);
      }
    }

    checkLoginStatus();
  }, []);

  async function handleLogout() {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        setIsLoggedIn(false);
        router.push('/');
        router.refresh();
      } else {
        console.error('로그아웃 실패');
      }
    } catch (error) {
      console.error('로그아웃 요청 중 에러 발생:', error);
    }
  }

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="flex h-16 items-center justify-between px-6">
        <Link href="/" className="flex items-center text-lg font-bold tracking-tight">
          Screen Reader Studio
        </Link>
        {isLoggedIn ? (
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="flex w-20 items-center tracking-tight"
          >
            로그아웃
          </Button>
        ) : (
          <Button
            onClick={() => router.push('/login')}
            variant="ghost"
            className="flex w-20 items-center tracking-tight"
          >
            로그인
          </Button>
        )}
      </div>
    </header>
  );
}
