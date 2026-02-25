'use client';

import { useEffect, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import type { TrendDataPoint } from '@/hooks/use-message-trend';

interface MessageTrendChartProps {
  data?: TrendDataPoint[];
  isLoading?: boolean;
}

function ChartLegend() {
  return (
    <div className="flex items-center gap-3 text-xs text-muted-foreground">
      <span className="flex items-center gap-1.5">
        <span className="size-2 rounded-sm" style={{ background: 'hsl(var(--info) / 0.5)' }} />
        Total
      </span>
    </div>
  );
}

function computeYTicks(data: TrendDataPoint[] | undefined): { domain: [number, number]; ticks: number[] } {
  const maxCount = data && data.length > 0 ? Math.max(...data.map((d) => d.count), 0) : 0;
  const yMax = Math.max(Math.ceil(maxCount * 1.25), 4);
  const step = Math.ceil(yMax / 4);
  const ticks = Array.from({ length: 5 }, (_, i) => i * step);
  return { domain: [0, ticks[4]], ticks };
}

export default function MessageTrendChart({ data, isLoading }: MessageTrendChartProps) {
  const [isMounted, setIsMounted] = useState(false);
  const hasData = Boolean(data && data.length > 0);
  const { domain, ticks } = computeYTicks(data);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (isLoading) {
    return (
      <Card className="border border-border/50">
        <CardHeader className="px-4 pt-2.5 pb-1 sm:px-5 sm:pt-3">
          <CardTitle className="text-sm font-medium">Message Volume (7 days)</CardTitle>
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
        <div className="flex items-baseline justify-between">
          <CardTitle className="text-sm font-medium">Message Volume (7 days)</CardTitle>
          {hasData ? <ChartLegend /> : null}
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-2.5 sm:px-5 sm:pb-3">
        <div className="h-[140px] md:h-[180px] min-h-[140px] w-full min-w-0">
          {hasData ? (
            isMounted ? (
              <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={140} debounce={80}>
                <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--info))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--info))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    domain={domain}
                    ticks={ticks}
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '0.5rem',
                      fontSize: '12px',
                      color: 'hsl(var(--foreground))'
                    }}
                    labelStyle={{ color: 'hsl(var(--muted-foreground))' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="hsl(var(--info))"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorCount)"
                    name="Messages"
                    dot={{ r: 3, fill: 'hsl(var(--info))', strokeWidth: 0 }}
                    activeDot={{ r: 5, fill: 'hsl(var(--info))', strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : null
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              No data available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
