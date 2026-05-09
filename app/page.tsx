import MainNav from '@/components/MainNav'
import Footer from '@/components/Footer'
import ScrollProgress from '@/components/ScrollProgress'
import OrbitSection from '@/components/sections/OrbitSection'
import SupportingArchitectureSection from '@/components/sections/SupportingArchitectureSectionLive'
import ProtocolSection from '@/components/sections/ProtocolSection'
import WhyNexoviaSection from '@/components/sections/WhyNexoviaSection'
import FAQSection from '@/components/sections/FAQSection'
import CopyEditor from '@/components/CopyEditor'

export default function Home() {
  return (
    <>
      <MainNav />
      <ScrollProgress />
      <main>
        <OrbitSection />
        <SupportingArchitectureSection />
        <ProtocolSection />
        <WhyNexoviaSection />
        <FAQSection />
      </main>
      <Footer />
      <CopyEditor />
    </>
  )
}
