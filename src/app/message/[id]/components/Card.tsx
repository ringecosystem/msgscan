import React from 'react';

interface CardProps {
  title: string;
  icon: React.ReactNode;
}

const Card = ({ title, icon, children }: React.PropsWithChildren<CardProps>) => {
  return (
    <div className="flex flex-col items-center gap-[0.62rem] rounded bg-card p-5 lg:flex-row">
      <div className="flex w-full items-center gap-[0.31rem] text-muted-foreground lg:w-[14.12rem]">
        {icon}
        <h3 className="w-auto text-xs font-normal leading-6 lg:w-[12.5rem] lg:text-sm">{title}</h3>
      </div>
      <div className="w-full text-xs font-normal leading-6 text-foreground lg:w-[calc(100%-14.12rem)] lg:text-sm">
        {children}
      </div>
    </div>
  );
};
export default Card;
