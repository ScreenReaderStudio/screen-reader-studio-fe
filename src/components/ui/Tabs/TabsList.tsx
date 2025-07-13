import { ReactNode } from 'react';

import { cn } from '@/utils/cn';

interface TabsListProps {
  children: ReactNode;
  className?: string;
}

export default function TabsList({ children, className }: TabsListProps) {
  return (
    <div
      role="tablist"
      aria-orientation="horizontal"
      className={cn(
        'inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1',
        className
      )}
    >
      {children}
    </div>
  );
}
