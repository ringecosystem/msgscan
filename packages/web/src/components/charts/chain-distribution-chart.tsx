'use client';

import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { formatNumber } from '@/utils';

import type { ChainDistributionItem, ChainDirection } from '@/hooks/use-chain-distribution';

interface ChainDistributionChartProps {
  data?: ChainDistributionItem[];
  targetData?: ChainDistributionItem[];
  isLoading?: boolean;
  isTargetLoading?: boolean;
}

function renderActiveBar(props: {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  fill?: string;
}) {
  const x = props.x ?? 0;
  const y = props.y ?? 0;
  const width = props.width ?? 0;
  const height = props.height ?? 0;

  // Keep hover feedback subtle to avoid layout jitter in compact cards.
  return (
    <Rectangle
      x={x}
      y={y - 1}
      width={width * 1.015}
      height={height + 2}
      fill={props.fill ?? 'hsl(var(--info))'}
      radius={[0, 5, 5, 0]}
    />
  );
}

export default function ChainDistributionChart({
  data,
  targetData,
  isLoading,
  isTargetLoading
}: ChainDistributionChartProps) {
  const MAX_VISIBLE_CHAINS = 5;
  const [direction, setDirection] = useState<ChainDirection>('source');
  const [isMounted, setIsMounted] = useState(false);

  const activeData = direction === 'source' ? data : targetData;
  const activeLoading = direction === 'source' ? isLoading : isTargetLoading;
  const chartData = (activeData ?? []).slice(0, MAX_VISIBLE_CHAINS);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (activeLoading) {
    return (
      <Card className="border border-border/50">
        <CardHeader className="px-4 pt-2.5 pb-1 sm:px-5 sm:pt-3">
          <CardTitle className="text-sm font-medium">Chain Distribution</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-2.5 sm:px-5 sm:pb-3">
          <Skeleton className="h-[140px] md:h-[180px] w-full rounded" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border/50">
      <CardHeader className="px-4 pt-2.5 pb-1 sm:px-5 sm:pt-3">
        <div className="inline-flex rounded-md bg-muted p-0.5">
          <button
            type="button"
            onClick={() => setDirection('source')}
            aria-pressed={direction === 'source'}
            className={cn(
              'rounded px-3 py-1 text-xs font-medium transition-colors cursor-pointer',
              direction === 'source'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Source Chain
          </button>
          <button
            type="button"
            onClick={() => setDirection('target')}
            aria-pressed={direction === 'target'}
            className={cn(
              'rounded px-3 py-1 text-xs font-medium transition-colors cursor-pointer',
              direction === 'target'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Target Chain
          </button>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-2.5 sm:px-5 sm:pb-3">
        {chartData.length === 0 ? (
          <div className="flex h-[140px] md:h-[180px] items-center justify-center text-sm text-muted-foreground">
            No data available
          </div>
        ) : (
          <div className="h-[140px] md:h-[180px] min-h-[140px] w-full min-w-0">
            {isMounted ? (
              <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={140} debounce={80}>
                <BarChart
                  data={chartData}
                  layout="vertical"
                  margin={{ top: 8, right: 56, left: 0, bottom: 2 }}
                  barCategoryGap="24%"
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                    tickFormatter={(v) => formatNumber(Number(v))}
                  />
                  <YAxis
                    type="category"
                    dataKey="chainName"
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                    tickLine={false}
                    axisLine={false}
                    interval={0}
                    tickMargin={8}
                    width={96}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '0.5rem',
                      fontSize: '12px',
                      color: 'hsl(var(--foreground))'
                    }}
                    cursor={false}
                    formatter={(value) => [formatNumber(Number(value)), 'Messages']}
                  />
                  <Bar
                    dataKey="count"
                    fill="hsl(var(--info))"
                    radius={[0, 4, 4, 0]}
                    barSize={14}
                    activeBar={renderActiveBar}
                  >
                    <LabelList
                      dataKey="count"
                      position="right"
                      style={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                      formatter={(v) => formatNumber(Number(v))}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : null}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
