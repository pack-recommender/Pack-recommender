const SITE_URL = 'https://packrecommender.com';

export interface SeoProps {
  title: string;
  description: string;
  path: string;
  image?: string;
}

export function getCanonicalUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
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
      availableLanguage: ['English'],
    },
  };
}

export function getOgImageUrl(image?: string): string {
  return image ? `${SITE_URL}${image}` : `${SITE_URL}/og-image.png`;
}
