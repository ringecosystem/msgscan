'use client';

import { useState, useCallback, useEffect } from 'react';
import { Search, X } from 'lucide-react';

import { ModeToggle } from './mode-toggle';
import SearchBar from './search-bar';
import NetworkSwitcher from './network-switcher';
import HeaderLogo from './header-logo';

const Header = () => {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const openMobileSearch = useCallback(() => setMobileSearchOpen(true), []);
  const closeMobileSearch = useCallback(() => setMobileSearchOpen(false), []);

  useEffect(() => {
    if (!mobileSearchOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        closeMobileSearch();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [mobileSearchOpen, closeMobileSearch]);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <HeaderLogo />

          <div className="hidden flex-1 justify-center md:flex">
            <SearchBar />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openMobileSearch}
              className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
              aria-label="Search messages"
            >
              <Search className="size-5" />
            </button>
            <NetworkSwitcher />
            <ModeToggle />
          </div>
        </div>
      </header>

      {/* Mobile search overlay */}
      {mobileSearchOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Search"
          className="animate-in fade-in slide-in-from-top-2 duration-200 fixed inset-0 z-50 flex flex-col bg-background md:hidden"
          onClick={(e) => { if (e.target === e.currentTarget) closeMobileSearch(); }}
        >
          <div className="flex h-16 items-center justify-between px-4">
            <span className="text-sm font-medium">Search</span>
            <div className="flex items-center gap-2">
              <span className="hidden text-xs text-muted-foreground sm:inline">Press Esc to close</span>
              <button
                type="button"
                onClick={closeMobileSearch}
                className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Close search"
              >
                <X className="size-5" />
              </button>
            </div>
          </div>
          <div className="px-4">
            <SearchBar autoFocus={true} onNavigate={closeMobileSearch} />
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
