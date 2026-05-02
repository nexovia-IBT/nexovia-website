import type { Metadata } from 'next'
import { GFS_Didot } from 'next/font/google'
import './globals.css'

const gfsDidot = GFS_Didot({
  weight: '400',
  subsets: ['latin', 'greek'],
  variable: '--font-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Nexovia — Post-Procedure Skincare',
  description: 'Post-procedure skincare reimagined.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={gfsDidot.variable}>
      <body>{children}</body>
    </html>
  )
}
