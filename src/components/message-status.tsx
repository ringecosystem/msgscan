import Image from 'next/image';
import { Badge } from '@/components/ui/badge';

import { MESSAGE_STATUS } from '@/types/message';
import Inflight from './icon/inflight';
import Success from './icon/success';
import Failed from './icon/failed';

interface MessageStatusProps {
  status: MESSAGE_STATUS;
}

const MessageStatus = ({ status }: MessageStatusProps) => {
  switch (status) {
    case MESSAGE_STATUS.PENDING:
      return (
        <Badge className="gap-[0.19rem] bg-[hsl(var(--inflight))] text-xs text-foreground hover:bg-[hsl(var(--inflight))]/80 dark:text-background">
          <Inflight />
          Inflight
        </Badge>
      );

    case MESSAGE_STATUS.SUCCESS:
      return (
        <Badge className="gap-[0.19rem] bg-[hsl(var(--success))] text-xs text-foreground hover:bg-[hsl(var(--success))]/80 dark:text-background">
          <Success />
          Success
        </Badge>
      );
    case MESSAGE_STATUS.FAILED:
      return (
        <Badge className="gap-[0.19rem] bg-[hsl(var(--failure))] text-xs text-foreground hover:bg-[hsl(var(--failure))]/80 dark:text-background">
          <Failed />
          Failed
        </Badge>
      );

    default:
      return null;
  }
};

export default MessageStatus;
