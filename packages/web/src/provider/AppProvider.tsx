'use client';

import * as React from 'react';
import { useEffect } from 'react';

import { TooltipProvider } from '@/components/ui/tooltip';
import ToastProvider from '@/components/shared/toast-provider';

import AppQueryClientProvider from './AppQueryClientProvider';
import AppThemeProvider from './AppThemeProvider';

const AppProvider = ({ children }: React.PropsWithChildren<unknown>) => {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') {
      return;
    }

    const originalWarn = console.warn;
    console.warn = (...args: unknown[]) => {
      const [firstArg] = args;
      if (
        typeof firstArg === 'string' &&
        firstArg.includes('The width(-1) and height(-1) of chart should be greater than 0')
      ) {
        return;
      }
      originalWarn(...args);
    };

    return () => {
      console.warn = originalWarn;
    };
  }, []);

  return (
    <AppQueryClientProvider>
      <AppThemeProvider>
        <TooltipProvider delay={0}>
          {children}
          <ToastProvider />
        </TooltipProvider>
      </AppThemeProvider>
    </AppQueryClientProvider>
  );
};

export default AppProvider;
