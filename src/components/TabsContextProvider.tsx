import { Tabs } from '@/components/ui/Tabs';

import type { ReactNode } from 'react';

interface TabsContextProviderProps {
  children: ReactNode;
  defaultValue: string;
  className?: string;
}

export default function TabsContextProvider({
  children,
  defaultValue = 'code',
  className,
}: TabsContextProviderProps) {
  return (
    <Tabs defaultValue={defaultValue} className={className}>
      {children}
    </Tabs>
  );
}
