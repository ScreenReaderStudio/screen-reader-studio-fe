import { ReactNode } from 'react';

import { cn } from '@/utils/cn';

interface TabsProps {
  children: ReactNode;
  className?: string;
}

export default function Tabs({ children, className }: TabsProps) {
  return (
    <div dir="ltr" className={cn(className)}>
      {children}
    </div>
  );
}
