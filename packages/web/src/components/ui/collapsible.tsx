'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

interface CollapsibleContextValue {
  open: boolean;
  toggle: () => void;
}

const CollapsibleContext = React.createContext<CollapsibleContextValue>({
  open: false,
  toggle: () => {},
});

function Collapsible({
  defaultOpen = false,
  className,
  children,
  ...props
}: React.ComponentProps<'div'> & { defaultOpen?: boolean }) {
  const [open, setOpen] = React.useState(defaultOpen);
  const toggle = React.useCallback(() => setOpen((prev) => !prev), []);

  return (
    <CollapsibleContext.Provider value={{ open, toggle }}>
      <div className={cn(className)} data-state={open ? 'open' : 'closed'} {...props}>
        {children}
      </div>
    </CollapsibleContext.Provider>
  );
}

function CollapsibleTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<'button'>) {
  const { open, toggle } = React.useContext(CollapsibleContext);

  return (
    <button
      type="button"
      aria-expanded={open}
      onClick={toggle}
      className={cn('flex w-full items-center', className)}
      {...props}
    >
      {children}
    </button>
  );
}

function CollapsibleContent({
  className,
  children,
  ...props
}: React.ComponentProps<'div'>) {
  const { open } = React.useContext(CollapsibleContext);

  return (
    <div
      className={cn(
        'grid transition-[grid-template-rows] duration-300 ease-in-out',
        open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
      )}
      {...props}
    >
      <div className={cn('overflow-hidden', className)}>
        {children}
      </div>
    </div>
  );
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
