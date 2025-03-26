import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'; // 假设shadcn已经提供了Tooltip组件
import { cn } from '@/lib/utils';
import { toShortText } from '@/utils';
import { CodeFont } from '@/config/font';

import type { CHAIN } from '@/types/chains';

interface ChainTxDisplayProps {
  chain?: CHAIN;
  value?: string;
  isLink?: boolean;
  href?: string;
  isFullText?: boolean;
  rootClassName?: string;
  className?: string;
  iconClassName?: string;
}

const ChainTxDisplay = ({
  chain,
  value,
  isLink = true,
  href,
  isFullText = false,
  rootClassName,
  className,
  iconClassName,
  children
}: React.PropsWithChildren<ChainTxDisplayProps>) => {
  const renderContent = () => {
    let txLink = `${chain?.blockExplorers?.default?.url}/tx/${value}`;

    if (chain?.name.includes("Tron")) {
      txLink = `${chain?.blockExplorers?.default?.url}/#/transaction/${value?.replace('0x', '')}`
    }
    if (isLink) {
      if (href) {
        return (
          <Link
            href={href}
            className={cn('truncate hover:underline', CodeFont.className, className)}
            title={value}
          >
            {isFullText
              ? value
              : toShortText({
                text: value,
                frontLength: 6,
                backLength: 4
              })}
          </Link>
        );
      }
      return (
        <Link
          href={txLink}
          className={cn('truncate hover:underline', CodeFont.className, className)}
          title={value}
          target="_blank"
          rel="noreferrer noopener"
        >
          {isFullText
            ? value
            : toShortText({
              text: value,
              frontLength: 6,
              backLength: 4
            })}
        </Link>
      );
    } else {
      return (
        <span className={cn('truncate', CodeFont.className, className)} title={value}>
          {isFullText
            ? value
            : toShortText({
              text: value,
              frontLength: 6,
              backLength: 4
            })}
        </span>
      );
    }
  };

  return (
    <div className={cn('flex items-center gap-[0.31rem]', rootClassName)}>
      {chain ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <Image
              width={20}
              height={20}
              alt=""
              src={chain.iconUrl}
              className={cn('rounded-full', iconClassName)}
            />
          </TooltipTrigger>
          <TooltipContent>{chain?.name}</TooltipContent>
        </Tooltip>
      ) : null}
      {renderContent()}
      {children}
    </div>
  );
};

export default ChainTxDisplay;
