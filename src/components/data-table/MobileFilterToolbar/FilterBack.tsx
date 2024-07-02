import { ArrowLeft } from 'lucide-react';

interface FilterBackProps {
  onClick: () => void;
  title: string;
  isShowIcon?: boolean;
}
const MobileFilterBack = ({ onClick, title, isShowIcon = true }: FilterBackProps) => {
  return (
    <div
      onClick={onClick}
      className="absolute left-4 top-4 flex cursor-pointer items-center gap-[0.25rem] text-sm font-normal text-foreground hover:opacity-80"
    >
      {isShowIcon ? <ArrowLeft strokeWidth={1.25} size={24} /> : null}
      <span>{title}</span>
    </div>
  );
};

export default MobileFilterBack;
