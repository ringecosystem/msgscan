import React from 'react';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

interface ExplorerLinkButtonProps {
  url?: string;
  size?: string | number;
}

const ExplorerLinkButton: React.FC<ExplorerLinkButtonProps> = ({ url, size = 16 }) => {
  if (!url) {
    return null;
  }

  const tooltipUrl = url.length > 25 ? `${url.slice(0, 25)}...` : url;

  return (
    <Tooltip>
      <TooltipTrigger
        render={<span className="inline-flex" />}
      >
        <Link
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open transaction in block explorer"
          className="inline-flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 rounded-sm"
        >
          <ExternalLink
            size={size}
            strokeWidth={1.5}
            className="text-muted-foreground hover:text-muted-foreground"
          />
        </Link>
      </TooltipTrigger>
      <TooltipContent>{tooltipUrl}</TooltipContent>
    </Tooltip>
  );
};

export default ExplorerLinkButton;
