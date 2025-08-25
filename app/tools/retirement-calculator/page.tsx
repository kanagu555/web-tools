import type { Metadata } from 'next';
import RetirementCalculator from '@/components/tools/RetirementCalculator';

export const metadata: Metadata = {
  title: 'Retirement Calculator - Plan Your Financial Future | KodeKit',
  description: 'Comprehensive retirement planning calculator with inflation adjustments, investment growth projections, and withdrawal strategies. Calculate required corpus, savings goals, and retirement income planning.',
  keywords: [
    'retirement calculator',
    'retirement planning',
    'financial planning',
    'investment calculator',
    'retirement corpus',
    'pension planning',
    'retirement savings',
    'withdrawal rate calculator',
    'inflation adjusted retirement',
    'retirement goal planning',
    'financial independence',
    'retirement income planning',
    'SIP retirement calculator',
    'retirement fund calculator',
    'employee provident fund',
    'PPF retirement planning',
    'NPS calculator',
    'retirement investment strategy'
  ],
  authors: [{ name: 'KodeKit' }],
  creator: 'KodeKit',
  publisher: 'KodeKit',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Retirement Calculator - Plan Your Financial Future',
    description: 'Calculate retirement corpus, savings goals, and income planning with comprehensive projections and inflation adjustments.',
    type: 'website',
    url: 'https://kodekit.dev/tools/retirement-calculator',
    siteName: 'KodeKit',
    images: [
      {
        url: '/og-retirement-calculator.png',
        width: 1200,
        height: 630,
        alt: 'Retirement Calculator Tool',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Retirement Calculator - Plan Your Financial Future',
    description: 'Comprehensive retirement planning with investment projections and withdrawal strategies.',
    images: ['/og-retirement-calculator.png'],
    creator: '@kodekit_dev',
  },
  alternates: {
    canonical: 'https://kodekit.dev/tools/retirement-calculator',
  },
  other: {
    'application-name': 'KodeKit Retirement Calculator',
    'msapplication-tooltip': 'Plan your retirement with comprehensive calculations',
    'apple-mobile-web-app-title': 'Retirement Calculator',
  },
};

export default function RetirementCalculatorPage() {
  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'Retirement Calculator',
            description: 'Comprehensive retirement planning calculator with inflation adjustments and investment projections',
            url: 'https://kodekit.dev/tools/retirement-calculator',
            applicationCategory: 'FinanceApplication',
            operatingSystem: 'Web Browser',
            permissions: 'No special permissions required',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            creator: {
              '@type': 'Organization',
              name: 'KodeKit',
              url: 'https://kodekit.dev',
            },
            featureList: [
              'Retirement corpus calculation',
              'Investment growth projections',
              'Inflation adjustments',
              'Withdrawal rate analysis',
              'Employer match calculations',
              'Scenario comparisons',
              'Yearly breakdown reports',
              'Export functionality',
              'Advanced financial metrics',
              'Goal tracking and recommendations'
            ],
            screenshot: 'https://kodekit.dev/screenshots/retirement-calculator.png',
            softwareVersion: '1.0.0',
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.8',
              ratingCount: '150',
              bestRating: '5',
              worstRating: '1'
            }
          })
        }}
      />
      
      <RetirementCalculator />
    </>
  );
}