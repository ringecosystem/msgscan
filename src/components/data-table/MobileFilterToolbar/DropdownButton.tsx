import SelectedLabels from '@/components/selected-labels';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { TableFilterOption } from '@/types/helper';
import { ChevronDown } from 'lucide-react';

interface DropdownButtonProps {
  onOpenChange?: (open: boolean) => void;
  title: React.ReactNode;
  options?: TableFilterOption[];
  value?: (string | number)[];
  className?: string;
}
const DropdownButton = ({
  onOpenChange,
  title,
  options,
  value,
  children,
  className
}: React.PropsWithChildren<DropdownButtonProps>) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => onOpenChange?.(true)}
      className={cn(
        'flex items-center gap-[0.31rem] border-none text-sm font-normal focus-visible:ring-0',
        className
      )}
    >
      <span className="text-secondary-foreground">{title}</span>
      <div className="flex items-center gap-[0.31rem] hover:opacity-80">
        {value && options?.length ? <SelectedLabels options={options} value={value} /> : null}
        {children}
        <ChevronDown size={16} strokeWidth={1.5} />
      </div>
    </Button>
  );
};

export default DropdownButton;
