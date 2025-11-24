import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

async function Footer() {
  const t = await getTranslations('Footer');
  return (
    <footer className="w-full h-20 border-t gap-0.5 flex justify-center items-center font-medium">
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
