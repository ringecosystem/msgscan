import { Inter } from 'next/font/google';
import { JetBrains_Mono } from 'next/font/google';

export const GlobalFont = Inter({
  subsets: ['latin'],
  variable: '--global-font'
});
export const CodeFont = JetBrains_Mono({
  subsets: ['latin'],
  weight: '400',
  variable: '--code-font'
});
