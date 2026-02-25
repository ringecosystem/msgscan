import { APP_NAME } from '@/config/site';
import { socialConfig } from '@/config/social';

const currentYear = new Date().getUTCFullYear();

const Footer = () => {
  return (
    <footer className="border-t border-border/40 bg-background pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-3 sm:px-6 md:py-2.5 lg:px-8">
        <span className="text-xs text-muted-foreground">
          &copy; {currentYear} {APP_NAME}
        </span>

        <div className="flex items-center gap-4">
          {socialConfig.map(({ url, name, icon }) => (
            <a
              key={name}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex size-5 shrink-0 items-center justify-center text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              title={name}
              aria-label={name}
            >
              {icon}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
