"use client";

import { ThemeProvider } from "next-themes";

import type * as React from "react";

const AppThemeProvider = ({ children }: React.PropsWithChildren<unknown>) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
};

export default AppThemeProvider;
