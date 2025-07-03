'use client';

import { createContext, useContext, useState } from 'react';

interface TabsContextType {
  selectedTab: string;
  setSelectedTab: (value: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

export function useTabsContext() {
  const context = useContext(TabsContext);

  if (!context) {
    throw new Error('Tabs components must be used within <Tabs>');
  }

  return context;
}

interface TabsProviderProps {
  children: React.ReactNode;
  defaultValue: string;
}

export function TabsProvider({ children, defaultValue }: TabsProviderProps) {
  const [selectedTab, setSelectedTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ selectedTab, setSelectedTab }}>{children}</TabsContext.Provider>
  );
}
