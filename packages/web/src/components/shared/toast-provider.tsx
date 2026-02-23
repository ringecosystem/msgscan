'use client';

import { Toaster } from 'sonner';
import { useTheme } from 'next-themes';

export default function ToastProvider() {
  const { resolvedTheme } = useTheme();

  return (
    <Toaster
      theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
      position="bottom-right"
      richColors
      closeButton
      toastOptions={{
        style: {
          fontSize: '13px'
        }
      }}
    />
  );
}
