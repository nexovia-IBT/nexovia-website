const FOOTER_LINKS = [
  { label: 'Formula', href: '#orbit-outer' },
  { label: 'Protocol', href: '#protocol-section' },
  { label: 'Science', href: '#sa-section' },
  { label: 'FAQ', href: '#faq' },
] as const

export default function Footer() {
  return (
    <footer className="bg-near-black border-t border-gold/7 pt-10 px-6 pb-7 md:pt-14 md:px-20 md:pb-9">

      <div className="max-w-[1360px] mx-auto flex flex-col items-center gap-7 text-center
        md:flex-row md:items-center md:justify-between md:gap-0 md:text-left">

        <div>
          <p className="font-serif text-gold text-[26px] leading-none">Nexovia</p>
          <p className="text-[10px] uppercase tracking-[0.15em] text-white/30 mt-1.5">
            Post-procedure skincare
          </p>
        </div>

        <ul className="flex flex-wrap gap-7 list-none m-0 p-0 justify-center md:justify-end">
          {FOOTER_LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="text-[10px] uppercase tracking-[0.12em] text-white/30 no-underline
                  transition-colors duration-300 hover:text-gold"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

      </div>

      <div className="max-w-[1360px] mx-auto text-center mt-9 pt-[22px] border-t border-white/5">
        <p className="text-[10px] text-white/30">
          Copyright 2026 Nexovia. Cosmetic skincare information only; follow practitioner guidance after procedures.
        </p>
      </div>

    </footer>
  )
}
