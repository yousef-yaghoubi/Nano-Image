import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

const disallowedPaths = routing.locales.flatMap((locale) => [
  `/${locale}/newPrompt`,
  `/${locale}/admin`,
  `/${locale}/admin/`,
  `/${locale}/profile`,
  `/${locale}/profile/`,
]);

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: disallowedPaths,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
