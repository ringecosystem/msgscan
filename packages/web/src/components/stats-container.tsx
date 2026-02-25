'use client';

import Image from 'next/image';
import { Activity, CheckCircle, Globe, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

import { CodeFont } from '@/config/font';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip';

import { StatCard } from './stat-card';

import type { CHAIN } from '@/types/chains';
import type { MessageStats } from '@/types/messages';
import type { TrendDataPoint } from '@/hooks/use-message-trend';

interface StatsContainerProps {
  data?: MessageStats;
  chains: CHAIN[];
  trendData?: TrendDataPoint[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
}

function ChainIconGrid({ chains }: { chains: CHAIN[] }) {
  const visible = chains.slice(0, 4);
  const overflow = chains.length - visible.length;
  const overflowNames = chains.slice(4).map((c) => c.name).join(', ');

  return (
    <div className="flex items-center gap-2 mt-2">
      <div className="flex -space-x-1.5">
        {visible.map((chain) => (
          <Image
            key={chain.id}
            src={chain.iconUrl}
            alt={chain.name}
            width={24}
            height={24}
            className="size-6 rounded-full ring-2 ring-card"
          />
        ))}
      </div>
      {overflow > 0 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              className="cursor-default text-xs text-muted-foreground"
              aria-label={`${overflow} more chains: ${overflowNames}`}
            >
              +{overflow}
            </TooltipTrigger>
            <TooltipContent side="top">
              {overflowNames}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}

const StatsContainer = ({
  data,
  chains,
  trendData,
  isLoading = false,
  isError = false,
  onRetry
}: StatsContainerProps) => {
  const sparklineData = trendData?.map((d) => d.count);
  const rateBadgeClass =
    'inline-flex min-w-[3.5rem] items-center justify-center rounded-md border px-2 py-0.5 text-base font-semibold leading-none';

  const successRate =
    data && data.total > 0
      ? `${((data.success / data.total) * 100).toFixed(1)}%`
      : undefined;
  const failedRate =
    data && data.total > 0
      ? `${((data.failed / data.total) * 100).toFixed(1)}%`
      : undefined;

  const failedRateNum = data && data.total > 0 ? (data.failed / data.total) * 100 : 0;
  const failedColorClass =
    failedRateNum >= 0.01
      ? 'border-failure/45 bg-failure/12 text-failure'
      : 'border-border bg-muted/50 text-muted-foreground';

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.08 }
    }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } }
  };

  return (
    <div className="space-y-3" aria-busy={isLoading}>
      {isError ? (
        <div
          role="alert"
          className="flex items-center justify-between gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3"
        >
          <span className="text-sm text-destructive">
            Failed to refresh stats. Showing last known values.
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7 border-destructive/40 px-2 py-0.5 text-xs text-destructive hover:border-destructive/60 hover:bg-destructive/10 hover:text-destructive"
            onClick={onRetry}
          >
            Retry
          </Button>
        </div>
      ) : null}
      <motion.div
        className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-3 lg:gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
        <StatCard
          title="Total Messages"
          value={data?.total}
          icon={<Activity className="size-4" />}
          sparklineData={sparklineData}
          sparklineColor="bg-primary/50"
          reserveSparklineSpace
        />
        </motion.div>
        <motion.div variants={itemVariants}>
        <StatCard
          title="Networks"
          icon={<Globe className="size-4" />}
        >
          <div
            className={cn('text-xl font-semibold tracking-tight md:text-2xl lg:text-3xl', CodeFont.className)}
          >
            {chains.length}
          </div>
          <ChainIconGrid chains={chains} />
        </StatCard>
        </motion.div>
        <motion.div variants={itemVariants}>
        <StatCard
          title="Success"
          value={data?.success}
          icon={<CheckCircle className="size-4 text-success" />}
          subtitle={
            successRate && (
              <span className={cn(rateBadgeClass, 'border-success/40 bg-success/12 text-success')}>
                {successRate}
              </span>
            )
          }
        />
        </motion.div>
        <motion.div variants={itemVariants}>
        <StatCard
          title="Failed"
          value={data?.failed}
          icon={<XCircle className="size-4 text-failure" />}
          subtitle={
            failedRate && (
              <span className={cn(rateBadgeClass, failedColorClass)}>
                {failedRate}
              </span>
            )
          }
        />
        </motion.div>
      </motion.div>
    </div>
  );
};
export default StatsContainer;
