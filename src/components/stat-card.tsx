import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { convertToNumber } from '@/utils';
import Counter from './counter';
import { Separator } from './ui/separator';

interface StatCardProps {
  title: string;
  value?: number | string;
  percentageChange: number;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, percentageChange }) => {
  const numberValue = convertToNumber(value);
  return (
    <Card className="border-none bg-transparent py-0 sm:py-5">
      <CardHeader className="flex flex-row items-center justify-between p-0">
        <CardTitle className="text-xs font-normal leading-[1.4rem] text-secondary-foreground sm:text-sm">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between p-0 sm:flex-col sm:items-start sm:justify-start">
        <div className="text-xl leading-[2rem] tracking-[0.0625rem] sm:text-[1.625rem] sm:leading-[2.6rem]">
          <Counter target={numberValue} />
        </div>
        {/* <p className="text-xs text-muted-foreground">
          {percentageChange > 0 ? `+${percentageChange}%` : `${percentageChange}%`} from last month
        </p> */}
      </CardContent>
      {<Separator className="block w-full sm:hidden" />}
    </Card>
  );
};
