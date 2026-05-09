import type { Metadata } from 'next'
import Footer from '@/components/Footer'
import MainNav from '@/components/MainNav'

export const metadata: Metadata = {
  title: 'Contact | Nexovia',
  description: 'Contact Nexovia for post-procedure skincare and practitioner inquiries.',
  alternates: { canonical: 'https://nexovia.pro/contact' },
}

export default function ContactPage() {
  return (
    <>
      <MainNav />
      <main className="min-h-screen bg-pale px-6 pb-24 pt-40 text-dark sm:px-8 lg:px-12">
        <section className="mx-auto max-w-[900px] text-center">
          <p className="font-sans text-[11px] uppercase tracking-[0.34em] text-burgundy">Contact</p>
          <h1 className="mt-6 font-display text-[clamp(48px,6vw,80px)] font-normal leading-[0.98] text-dark">Begin the Conversation</h1>
          <p className="mx-auto mt-7 max-w-[620px] font-body text-[22px] font-light leading-[1.45] text-dark/50">For practitioner inquiries, recovery guidance, or product questions, reach the Nexovia team directly.</p>
          <a href="mailto:hello@nexovia.pro" className="mt-9 inline-flex min-h-[44px] items-center bg-burgundy px-6 py-3 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-cream no-underline transition-colors duration-200 hover:bg-dark">
            hello@nexovia.pro
          </a>
        </section>
      </main>
      <Footer />
    </>
  )
}