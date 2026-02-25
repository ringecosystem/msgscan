import React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { convertToNumber } from '@/utils';
import { CodeFont } from '@/config/font';
import { cn } from '@/lib/utils';

import Counter from './counter';

interface StatCardProps {
  title: string;
  value?: number | string;
  icon?: React.ReactNode;
  sparklineData?: number[];
  sparklineColor?: string;
  reserveSparklineSpace?: boolean;
  subtitle?: React.ReactNode;
  children?: React.ReactNode;
}

function Sparkline({ data, color = 'bg-primary/60' }: { data: number[]; color?: string }) {
  const max = Math.max(...data, 1);
  return (
    <div className="mt-2 flex h-6 items-end gap-[2px] opacity-80">
      {data.map((v, i) => (
        <div
          key={i}
          className={`flex-1 min-w-[4px] h-full rounded-t ${color} origin-bottom`}
          style={{ transform: `scaleY(${Math.max(v / max, 0.04)})` }}
        />
      ))}
    </div>
  );
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  sparklineData,
  sparklineColor,
  reserveSparklineSpace,
  subtitle,
  children
}) => {
  const numberValue = convertToNumber(value);
  const isLoading = typeof value === 'undefined' && !children;
  const hasSparkline = !!(sparklineData && sparklineData.length > 0);

  return (
    <Card className="border border-border/50 bg-linear-to-br from-card to-card-elevated py-0 shadow-sm overflow-hidden transition-[border-color,box-shadow] duration-200 hover:border-foreground/20 hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between px-4 pt-2.5 pb-1 sm:px-5 sm:pt-3 sm:pb-1">
        <CardTitle className="text-xs font-medium text-muted-foreground sm:text-sm">
          {title}
        </CardTitle>
        {icon && <span className="text-muted-foreground">{icon}</span>}
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-center px-4 pt-2 pb-3 sm:px-5 sm:pt-3 sm:pb-4">
        {children ? (
          children
        ) : isLoading ? (
          <Skeleton className="h-7 w-20 rounded sm:h-9 sm:w-28" />
        ) : (
          <>
            <div className={cn('text-xl font-semibold tracking-tight md:text-2xl lg:text-3xl', CodeFont.className)}>
              <Counter target={numberValue} />
            </div>
            {hasSparkline && (
              <Sparkline data={sparklineData} color={sparklineColor} />
            )}
            {!hasSparkline && reserveSparklineSpace && (
              <div className="mt-2 h-6" aria-hidden />
            )}
            {subtitle && (
              <div className="mt-2 flex h-6 items-center text-xs text-muted-foreground">{subtitle}</div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
