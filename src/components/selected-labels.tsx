import React from 'react';
import { Badge } from '@/components/ui/badge'; // 确保路径正确
import { TableFilterOption } from '@/types/helper';

interface SelectedLabelsProps {
  options: TableFilterOption[];
  value: (string | number)[];
}
const SelectedLabels = ({ options, value }: SelectedLabelsProps) => {
  const selectedOptions = options.filter((option) => value.includes(option.value));

  if (value.length > 1) {
    return <span className="text-sm text-foreground">Custom ({value?.length})</span>;
  } else if (value.length === 1) {
    return <span className="text-sm text-foreground">{selectedOptions?.[0].label}</span>;
  }
  return <span className="text-sm text-foreground">All</span>;
};

export default SelectedLabels;
