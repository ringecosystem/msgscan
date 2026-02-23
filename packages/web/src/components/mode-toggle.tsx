'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

const themeOptions = [
  { name: 'Light', value: 'light' },
  { name: 'Dark', value: 'dark' },
  { name: 'System', value: 'system' }
];

export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            size="icon"
            className="size-9 shrink-0 rounded-full border-border bg-transparent shadow-none dark:bg-input/30 dark:hover:bg-input/50"
            aria-label="Toggle theme"
          />
        }
      >
        <Sun className="size-4 rotate-0 scale-100 transition-[transform,opacity] dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute size-4 rotate-90 scale-0 transition-[transform,opacity] dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themeOptions.map((option) => (
          <DropdownMenuCheckboxItem
            key={option.value}
            onClick={() => setTheme(option.value)}
            checked={theme === option.value}
            className="flex items-center justify-between"
          >
            <span>{option.name}</span>
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
