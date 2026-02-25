import { ArrowLeft } from 'lucide-react';

interface FilterBackProps {
  onClick: () => void;
  title: string;
  isShowIcon?: boolean;
}
const MobileFilterBack = ({ onClick, title, isShowIcon = true }: FilterBackProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-[0.25rem] text-sm font-normal text-foreground hover:opacity-80"
      aria-label={isShowIcon ? 'Back' : title}
    >
      {isShowIcon ? <ArrowLeft strokeWidth={1.5} size={24} /> : null}
      <span>{title}</span>
    </button>
  );
};

export default MobileFilterBack;
