'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="flex h-16 justify-between px-4">
        <Link href="/" className="flex items-center text-lg font-bold tracking-tight">
          Screen Reader Studio
        </Link>
        <Link href="/login" className="flex items-center tracking-tight">
          로그인
        </Link>
      </div>
    </header>
  );
}
