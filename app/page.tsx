import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProductSection from "@/components/ProductSection";
import PromoSection from "@/components/PromoSection";
import CollectionSection from "@/components/CollectionSection";
import AboutSection from "@/components/AboutSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import { mockProducts } from "@/lib/mock-products";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ProductSection products={mockProducts} />
        <PromoSection />
        <CollectionSection products={mockProducts} />
        <AboutSection />
        <FAQSection />
      </main>
      <Footer />
    </>
  );
}
