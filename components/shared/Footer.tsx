import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

async function Footer() {
  const t = await getTranslations('Footer');
  return (
    <footer className="flex h-20 w-full items-center justify-center gap-0.5 border-t font-medium">
      <p className="mr-1">{t('copyright')}</p>
      <Link
        href={'https://github.com/yousef-yaghoubi'}
        className="text-primary font-bold"
        target="_blank"
      >
        {t('name')}
      </Link>
    </footer>
  );
}

export default Footer;
