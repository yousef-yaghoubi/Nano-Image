import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

const routes = ['', '/prompts'] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const route of routes) {
      entries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: route === '' ? 1.0 : 0.8,
        alternates: {
          languages: {
            ...Object.fromEntries(
              routing.locales.map((l) => [l, `${baseUrl}/${l}${route}`])
            ),
            'x-default': `${baseUrl}/${routing.defaultLocale}${route}`,
          },
        },
      });
    }
  }

  return entries;
}
