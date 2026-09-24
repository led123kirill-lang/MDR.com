import About from '@/components/About';
import Cases from '@/components/Cases';
import Catalog from '@/components/Catalog';
import Configurator from '@/components/Configurator';
import Contacts from '@/components/Contacts';
import FAQSupport from '@/components/FAQSupport';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import OrderModal from '@/components/OrderModal';
import Specs from '@/components/Specs';
import { SiteProvider } from '@/lib/site';

export default function Page() {
  return (
    <SiteProvider defaultModel="light">
      <div style={{ width: '100%', overflowX: 'hidden', background: '#08090c' }}>
        <Header />
        <Hero />
        <Specs />
        <Configurator />
        <Catalog />
        <Cases />
        <About />
        <FAQSupport />
        <Contacts />
        <Footer />
        <OrderModal />
      </div>
    </SiteProvider>
  );
}
