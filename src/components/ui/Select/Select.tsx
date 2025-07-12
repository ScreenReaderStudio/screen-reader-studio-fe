'use client';

import { Children, ReactNode, isValidElement, useMemo, useState } from 'react';

import { SelectProvider } from '@/components/ui/Select/context';

interface SelectProps {
  children: ReactNode;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

export default function Select({ children, defaultValue, onValueChange }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(defaultValue);

  const [trigger, content] = Children.toArray(children);

  const optionsMap = useMemo(() => {
    const map = new Map<string, ReactNode>();

    if (isValidElement(content)) {
      const contentElement = content as React.ReactElement<{ children?: ReactNode }>;

      Children.forEach(contentElement.props.children, (child) => {
        if (isValidElement(child)) {
          const childElement = child as React.ReactElement<{ value: string; children?: ReactNode }>;
          const value = childElement.props.value;

          if (value) {
            map.set(value, childElement.props.children);
          }
        }
      });
    }

    return map;
  }, [content]);

  const handleValueChange = (value: string) => {
    setSelectedValue(value);
    onValueChange?.(value);
    setIsOpen(false);
  };

  return (
    <SelectProvider
      value={{
        isOpen,
        setIsOpen,
        selectedValue,
        onValueChange: handleValueChange,
        optionsMap,
      }}
    >
      <div className="relative">
        {trigger}
        {isOpen && content}
      </div>
    </SelectProvider>
  );
}
