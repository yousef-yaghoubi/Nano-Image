import { useLocale } from 'next-intl';
import Link from 'next/link';

function Logo() {
  const locale = useLocale();
  return (
    <Link
      href={`/${locale}`}
      className="text-2xl lg:text-3xl font-extrabold text-gray-600 dark:text-gray-100 shrink-0"
    >
      Nano Image
    </Link>
  );
}

export default Logo;
