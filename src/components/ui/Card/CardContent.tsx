import { ReactNode } from 'react';

import { cn } from '@/utils/cn';

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export default function CardContent({ children, className }: CardContentProps) {
  return <div className={cn(className)}>{children}</div>;
}
