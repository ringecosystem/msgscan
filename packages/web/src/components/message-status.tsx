import { Loader2, Check, X } from 'lucide-react';

import { MESSAGE_STATUS } from '@/types/message';
import { cn } from '@/lib/utils';

interface MessageStatusProps {
  status: MESSAGE_STATUS;
}

const statusConfig = {
  [MESSAGE_STATUS.PENDING]: {
    label: 'Inflight',
    icon: Loader2,
    className: 'bg-warning/10 text-warning border-warning/20',
    spin: true,
  },
  [MESSAGE_STATUS.SUCCESS]: {
    label: 'Success',
    icon: Check,
    className: 'bg-success/10 text-success border-success/20',
    spin: false,
  },
  [MESSAGE_STATUS.FAILED]: {
    label: 'Failed',
    icon: X,
    className: 'bg-failure/10 text-failure border-failure/20',
    spin: false,
  },
} as const;

const MessageStatus = ({ status }: MessageStatusProps) => {
  const config = statusConfig[status];
  if (!config) return null;

  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium',
        config.className
      )}
    >
      <Icon className={cn('size-3', config.spin && 'animate-spin')} />
      {config.label}
    </span>
  );
};

export default MessageStatus;
