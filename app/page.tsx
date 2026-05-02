import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import ScrollProgress from '@/components/ScrollProgress'
import OrbitSection from '@/components/sections/OrbitSection'
import SupportingArchitectureSection from '@/components/sections/SupportingArchitectureSection'
import ProtocolSection from '@/components/sections/ProtocolSection'
import WhyNexoviaSection from '@/components/sections/WhyNexoviaSection'
import FAQSection from '@/components/sections/FAQSection'

export default function Home() {
  return (
    <>
      <Nav />
      <ScrollProgress />
      <main>
        <OrbitSection />
        <SupportingArchitectureSection />
        <ProtocolSection />
        <WhyNexoviaSection />
        <FAQSection />
      </main>
      <Footer />
    </>
  )
}
