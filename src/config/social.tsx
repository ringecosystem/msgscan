import Twitter from '@/components/icon/twitter';
import Telegram from '@/components/icon/telegram';
import Github from '@/components/icon/github';
type SocialConfig = { url: string; name: string; icon: React.ReactNode };

function createSocialConfig(name: string, url: string, icon: React.ReactNode): SocialConfig {
  return {
    name,
    url,
    icon
  };
}

export const socialConfig: SocialConfig[] = [
  createSocialConfig('Twitter', 'https://x.com/msgport_xyz', <Twitter />),
  createSocialConfig('Telegram', 'https://t.me/msgport', <Telegram />),
  createSocialConfig('Github', 'https://github.com/msgport', <Github />)
];
