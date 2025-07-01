import { ReactNode } from 'react';

import { useResultStore } from '@/stores/useResultStore';
import { cn } from '@/utils/cn';

interface TabsContentProps {
  children: ReactNode;
  className?: string;
  value: string;
}

export default function TabsContent({ children, className, value }: TabsContentProps) {
  const selectedTab = useResultStore((state) => state.selectedTab);

  if (selectedTab !== value) {
    return null;
  }

  return <div className={cn(className)}>{children}</div>;
}
