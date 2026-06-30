import type { Locale } from './i18n';

const SITE_URL = 'https://packrecommender.com';

export interface SeoProps {
  title: string;
  description: string;
  locale: Locale;
  path: string;
  image?: string;
}

export function getCanonicalUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}

export function getAlternateUrls(): { locale: Locale; url: string }[] {
  return [
    { locale: 'en', url: getCanonicalUrl('/') },
    { locale: 'he', url: getCanonicalUrl('/he') },
  ];
}

export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'PackRecommender',
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.ico`,
    description:
      'AI-powered packaging recommendation platform for manufacturers. Reduce costs, improve sustainability, and accelerate product development.',
    sameAs: [
      'https://www.linkedin.com/company/packrecommender',
      'https://github.com/packrecommender',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      email: 'hello@packrecommender.com',
      availableLanguage: ['English', 'Hebrew'],
    },
  };
}

export function getOgImageUrl(image?: string): string {
  return image ? `${SITE_URL}${image}` : `${SITE_URL}/og-image.png`;
}
