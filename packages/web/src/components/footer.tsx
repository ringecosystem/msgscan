import { APP_NAME } from '@/config/site';
import { socialConfig } from '@/config/social';

const currentYear = new Date().getUTCFullYear();

const Footer = () => {
  return (
    <footer className="container flex h-[var(--footer-height)] items-center">
      <div className="flex w-full items-center justify-between">
        <span className="text-xs font-light capitalize text-secondary-foreground lg:text-sm lg:text-foreground">
          &copy; {currentYear} {APP_NAME}
        </span>

        <div className="flex items-center gap-5">
          {socialConfig.map(({ url, name, icon }) => {
            return (
              <a
                key={name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-5 shrink-0 items-center justify-center transition hover:opacity-80 active:scale-95 active:opacity-60 lg:size-[1.625rem]"
                title={name}
              >
                {icon}
              </a>
            );
          })}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
