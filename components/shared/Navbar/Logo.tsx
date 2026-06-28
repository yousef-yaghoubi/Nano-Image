import { useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import logo from '@/public/NanoImage.png';
function Logo({ wordMark = false }: { wordMark?: boolean }) {
  const locale = useLocale();
  return (
    <Link
      href={`/${locale}`}
      className="flex flex-col items-center font-extrabold text-gray-600 dark:text-gray-100"
    >
      <Image src={logo} alt="NanoImage" width={44} height={44} />
      {wordMark && <span className="heading-1">Nano Image</span>}
    </Link>
  );
}

export default Logo;
