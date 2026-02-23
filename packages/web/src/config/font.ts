import { Geist, JetBrains_Mono } from 'next/font/google';

export const GlobalFont = Geist({
  subsets: ['latin'],
  variable: '--global-font'
});
export const CodeFont = JetBrains_Mono({
  subsets: ['latin'],
  weight: '400',
  variable: '--code-font'
});
