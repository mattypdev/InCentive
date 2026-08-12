export const SITE = 'https://incentivefinance.org'

export const ORG = {
  '@type': 'Organization',
  '@id': `${SITE}/#org`,
  name: 'Incentive',
  url: SITE,
  logo: {
    '@type': 'ImageObject',
    url: `${SITE}/coin-logo.png`,
  },
  sameAs: [
    'https://www.instagram.com/incentive.finance/',
    'https://www.linkedin.com/company/incentive-finance/',
  ],
}

export function breadcrumbLd(crumbs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
      ...crumbs.map(([name, path], i) => ({
        '@type': 'ListItem',
        position: i + 2,
        name,
        item: `${SITE}${path}`,
      })),
    ],
  }
}

export function webAppLd({ name, description, url }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name,
    description,
    url,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'All',
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    publisher: ORG,
  }
}
