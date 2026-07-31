import { getLocale } from 'next-intl/server';
import { auth } from '@clerk/nextjs/server';
import { MobileMenuClient } from './MobileMenuClient';

export async function MobileMenu() {
  const locale = await getLocale();
  const { isAuthenticated } = await auth();

  return <MobileMenuClient locale={locale} isAuthenticated={isAuthenticated} />;
}
