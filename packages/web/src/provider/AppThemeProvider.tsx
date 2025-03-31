"use client";

import * as React from "react";
import { ThemeProvider } from "next-themes";

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
