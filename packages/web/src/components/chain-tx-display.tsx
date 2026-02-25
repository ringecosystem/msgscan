import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
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
  showIcon?: boolean;
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
  showIcon = true,
  rootClassName,
  className,
  iconClassName,
  children
}: React.PropsWithChildren<ChainTxDisplayProps>) => {
  const renderContent = () => {
    const explorerBaseUrl = chain?.blockExplorers?.default?.url;
    let txLink = explorerBaseUrl ? `${explorerBaseUrl}/tx/${value}` : undefined;

    if (chain?.name?.includes('Tron') && explorerBaseUrl) {
      txLink = `${explorerBaseUrl}/#/transaction/${value?.replace('0x', '')}`;
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
      if (txLink) {
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
      }
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
  };

  return (
    <div className={cn('flex items-center gap-[0.31rem] relative z-10', rootClassName)}>
      {showIcon && chain ? (
        <Tooltip>
          <TooltipTrigger render={<span className="inline-flex" />}>
            <Image
              width={20}
              height={20}
              alt={`${chain.name} icon`}
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
