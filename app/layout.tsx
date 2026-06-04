import type { Metadata } from 'next'
import { GFS_Didot, Cormorant_Garamond } from 'next/font/google'
import './globals.css'

const gfsDidot = GFS_Didot({
  weight: '400',
  subsets: ['latin', 'greek'],
  variable: '--font-serif',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  weight: ['300', '400'],
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://nexovia.pro'),
  title: 'Nexovia | Post-Procedure Recovery Skincare',
  description:
    'Nexovia is a post-procedure skincare brand. Our focused recovery serum supports skin comfort, hydration, and barrier support in the days after aesthetic procedures.',
  applicationName: 'Nexovia',
  alternates: { canonical: 'https://nexovia.pro' },
  openGraph: {
    type: 'website',
    siteName: 'Nexovia',
    url: 'https://nexovia.pro',
    title: 'Nexovia | Post-Procedure Recovery Skincare',
    description: 'A focused post-procedure recovery serum for comfort, hydration, and barrier support.',
  },
}

// Brand-entity structured data so search engines associate the name "Nexovia"
// with this site (helps win the brand term and earn a knowledge panel).
const brandJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://nexovia.pro/#organization',
      name: 'Nexovia',
      url: 'https://nexovia.pro',
      description:
        'Nexovia is a post-procedure skincare brand. Its focused recovery serum supports skin comfort, hydration, and barrier support after aesthetic procedures.',
      sameAs: ['https://www.instagram.com/nexoviaofficial/'],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://nexovia.pro/#website',
      url: 'https://nexovia.pro',
      name: 'Nexovia',
      inLanguage: 'en',
      publisher: { '@id': 'https://nexovia.pro/#organization' },
    },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${gfsDidot.variable} ${cormorant.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(brandJsonLd) }}
        />
        {children}
      </body>
    </html>
  )
}
