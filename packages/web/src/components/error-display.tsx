'use client';
import Image from 'next/image';

interface Props {
  title: string;
  description: string;
  svgPath: string;
  svgPathLight: string;
}

const ErrorDisplay = ({ title, description, svgPath, svgPathLight }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center gap-[1.25rem]">
      <div className="relative h-[7.53125rem] w-[10rem]">
        <Image alt={title} src={svgPath} fill={true} className="hidden dark:inline" priority />
        <Image alt={title} src={svgPathLight} fill={true} className="inline dark:hidden" priority />
      </div>
      <div>
        <h2 className="text-center text-[1.875rem] font-bold italic leading-[3rem] text-foreground">
          {title}
        </h2>
        <p className="text-center text-sm font-normal leading-[3rem] text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
};

export default ErrorDisplay;
