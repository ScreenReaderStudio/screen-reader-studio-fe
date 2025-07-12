import { ReactNode } from 'react';

import { useSelectContext } from '@/components/ui/Select/context';
import { cn } from '@/utils/cn';

interface SelectContentProps {
  children: ReactNode;
  className?: string;
}

export default function SelectContent({ children, className }: SelectContentProps) {
  const { isOpen } = useSelectContext();

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className={cn(
        'absolute z-50 mt-1 w-full rounded-md border border-gray-200 bg-white p-1 shadow-md',
        className
      )}
    >
      {children}
    </div>
  );
}
