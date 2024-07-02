'use client';

import * as React from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import AppQueryClientProvider from './AppQueryClientProvider';
import AppThemeProvider from './AppThemeProvider';

const AppProvider = ({ children }: React.PropsWithChildren<unknown>) => {
  return (
    <AppQueryClientProvider>
      <AppThemeProvider>
        <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
      </AppThemeProvider>
    </AppQueryClientProvider>
  );
};

export default AppProvider;
