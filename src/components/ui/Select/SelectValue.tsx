import { ReactNode } from 'react';

import { useSelectContext } from '@/components/ui/Select/context';

interface SelectValueProps {
  placeholder?: ReactNode;
}

export default function SelectValue({ placeholder }: SelectValueProps) {
  const { selectedValue, optionsMap } = useSelectContext();

  const displayValue = selectedValue ? optionsMap.get(selectedValue) : undefined;

  return <>{displayValue || placeholder}</>;
}
