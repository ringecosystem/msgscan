'use client';

import { Copy, Check } from 'lucide-react';
import { useCallback, useEffect, useState, useRef } from 'react';
import { toast } from 'sonner';

import { cn } from '@/lib/utils';

import { Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';

interface ClipboardIconButtonProps {
  text?: string;
  size?: string | number;
}

const ClipboardIconButton = ({ text = '', size }: ClipboardIconButtonProps) => {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const enterTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const leaveTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const copiedTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const handleCopy = useCallback(() => {
    if (!text) return;
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);
        toast.success('Copied!');
        clearTimeout(copiedTimeout.current);
        copiedTimeout.current = setTimeout(() => {
          setCopied(false);
          copiedTimeout.current = undefined;
        }, 1000);
      })
      .catch((error) => {
        console.error('Copy failed:', error);
        toast.error('Failed to copy');
      });
  }, [text]);

  const handleMouseEnter = useCallback(() => {
    clearTimeout(leaveTimeout.current);
    enterTimeout.current = setTimeout(() => {
      setOpen(true);
    }, 300);
  }, []);

  const handleMouseLeave = useCallback(() => {
    clearTimeout(enterTimeout.current);
    leaveTimeout.current = setTimeout(() => {
      setOpen(false);
    }, 300);
  }, []);

  useEffect(() => {
    return () => {
      clearTimeout(enterTimeout.current);
      clearTimeout(leaveTimeout.current);
      clearTimeout(copiedTimeout.current);
    };
  }, []);

  if (!text) return null;

  return (
    <Tooltip open={open}>
      <TooltipTrigger
        type="button"
        onClick={handleCopy}
        className="inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-label="Copy to clipboard"
      >
        <Check
          strokeWidth={1.5}
          size={size}
          className={cn(
            'text-muted-foreground hover:text-muted-foreground/80',
            copied ? 'block' : 'hidden'
          )}
        />
        <Copy
          strokeWidth={1.5}
          size={size}
          className={cn(
            'text-muted-foreground hover:text-muted-foreground/80',
            copied ? 'hidden' : 'block'
          )}
        />
      </TooltipTrigger>
      <TooltipContent>{copied ? 'Copied!' : 'Copy to clipboard'}</TooltipContent>
    </Tooltip>
  );
};

export default ClipboardIconButton;
