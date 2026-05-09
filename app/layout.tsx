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
  title: 'Nexovia - Post-Procedure Skincare',
  description: 'A focused post-procedure serum for comfort, hydration, and barrier support.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${gfsDidot.variable} ${cormorant.variable}`}>
      <body>{children}</body>
    </html>
  )
}
