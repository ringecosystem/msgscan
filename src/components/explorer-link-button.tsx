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
      <TooltipTrigger asChild>
        <Link href={url} target="_blank" rel="noopener noreferrer">
          <ExternalLink
            size={size}
            strokeWidth={1.25}
            className="text-muted-foreground hover:text-muted-foreground"
          />
        </Link>
      </TooltipTrigger>
      <TooltipContent>{tooltipUrl}</TooltipContent>
    </Tooltip>
  );
};

export default ExplorerLinkButton;
