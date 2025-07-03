import { ReactNode } from 'react';

import { useTabsContext } from '@/components/ui/Tabs/context';
import { cn } from '@/utils/cn';

interface TabsContentProps {
  children: ReactNode;
  className?: string;
  value: string;
}

export default function TabsContent({ children, className, value }: TabsContentProps) {
  const { selectedTab } = useTabsContext();

  if (selectedTab !== value) {
    return null;
  }

  return <div className={cn(className)}>{children}</div>;
}
