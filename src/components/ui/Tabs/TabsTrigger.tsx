import { ReactNode } from 'react';

import { useResultStore } from '@/stores/useResultStore';
import { cn } from '@/utils/cn';

interface TabsTriggerProps {
  children: ReactNode;
  className?: string;
  value: string;
}

export default function TabsTrigger({ children, className, value }: TabsTriggerProps) {
  const selectedTab = useResultStore((state) => state.selectedTab);
  const setSelectedTab = useResultStore((state) => state.setSelectedTab);
  const isActive = selectedTab === value;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      className={cn(
        'inline-flex items-center justify-center rounded-sm px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-all',
        isActive ? 'bg-white' : 'text-muted-foreground',
        className
      )}
      onClick={() => setSelectedTab(value)}
    >
      {children}
    </button>
  );
}
