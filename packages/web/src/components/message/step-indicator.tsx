'use client';

import { cn } from '@/lib/utils';
import { MESSAGE_STATUS } from '@/types/message';

import type { CompositeMessage } from '@/types/messages';

interface StepIndicatorProps {
  message: CompositeMessage;
  className?: string;
}

type StepState = 'completed' | 'in-progress' | 'failed' | 'pending';

function getSteps(message: CompositeMessage): StepState[] {
  const hasSent = Boolean(message.sent);
  const hasAccepted = Boolean(message.accepted);
  const hasDispatched = Boolean(message.dispatched);
  const isFailed = message.status === MESSAGE_STATUS.FAILED;
  const isSuccess = message.status === MESSAGE_STATUS.SUCCESS;

  // Step 1: Sent
  const step1: StepState = hasSent ? 'completed' : 'pending';

  // Step 2: Signature/Accepted
  let step2: StepState = 'pending';
  if (hasAccepted) step2 = 'completed';
  else if (hasSent && !hasDispatched) step2 = 'in-progress';

  // Step 3: HashImported (we approximate - completed if dispatched exists)
  let step3: StepState = 'pending';
  if (hasDispatched) step3 = 'completed';
  else if (hasAccepted) step3 = 'in-progress';

  // Step 4: Dispatched
  let step4: StepState = 'pending';
  if (isSuccess) step4 = 'completed';
  else if (isFailed) step4 = 'failed';
  else if (hasDispatched) step4 = 'completed';

  return [step1, step2, step3, step4];
}

const stepColors: Record<StepState, string> = {
  completed: 'bg-step-4-success',
  'in-progress': 'bg-pending animate-step-pulse',
  failed: 'bg-step-4-failed',
  pending: 'bg-step-incomplete'
};

export default function StepIndicator({ message, className }: StepIndicatorProps) {
  const steps = getSteps(message);

  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {steps.map((state, index) => (
        <div key={index} className="flex items-center">
          <div
            className={cn('size-2 rounded-full', stepColors[state])}
            title={`Step ${index + 1}: ${state}`}
          />
          {index < steps.length - 1 && (
            <div
              className={cn(
                'h-px w-2',
                index < steps.findIndex((s) => s !== 'completed')
                  ? 'bg-step-4-success'
                  : 'bg-step-connector'
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
