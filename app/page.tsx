import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import Benefits from '@/components/landing/Benefits';
import Categories from '@/components/landing/Categories';
import SocialProof from '@/components/landing/SocialProof';
import Bonuses from '@/components/landing/Bonuses';
import Pricing from '@/components/landing/Pricing';
import Guarantee from '@/components/landing/Guarantee';
import FAQ from '@/components/landing/FAQ';
import Footer from '@/components/landing/Footer';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Benefits />
        <Categories />
        <SocialProof />
        <Bonuses />
        <Pricing />
        <Guarantee />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
