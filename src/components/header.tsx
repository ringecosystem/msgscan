import { ModeToggle } from './mode-toggle';

import SearchBar from './search-bar';
import NetworkSwitcher from './network-switcher';
import HeaderLogo from './header-logo';

const Header = () => {
  return (
    <header className="fixed left-0 top-0 z-50 w-screen bg-background/50 backdrop-blur-sm">
      <div className="container flex h-[var(--header-height)] items-center justify-between gap-4">
        <HeaderLogo />
        <div className="flex items-center gap-[0.62rem]">
          <div className="hidden lg:block">
            <SearchBar />
          </div>
          <NetworkSwitcher />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
