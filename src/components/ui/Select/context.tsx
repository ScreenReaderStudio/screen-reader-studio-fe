'use client';

import { createContext, useContext } from 'react';

interface SelectContextType {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  selectedValue?: string;
  onValueChange: (value: string) => void;
  optionsMap: Map<string, React.ReactNode>;
}

export const SelectContext = createContext<SelectContextType | undefined>(undefined);

export function useSelectContext() {
  const context = useContext(SelectContext);

  if (!context) {
    throw new Error('useSelectContext must be used within a SelectProvider');
  }

  return context;
}

export function SelectProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: SelectContextType;
}) {
  return <SelectContext.Provider value={value}>{children}</SelectContext.Provider>;
}
