import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProductSection from "@/components/ProductSection";
import PromoSection from "@/components/PromoSection";
import CollectionSection from "@/components/CollectionSection";
import AboutSection from "@/components/AboutSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import CartSync from "@/components/CartSync";
import { getProducts } from "@/lib/products";

// Stock levels change with every order, so this page is rendered fresh on
// every request rather than statically at build time.
export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await getProducts();

  return (
    <>
      <CartSync products={products} />
      <Navbar />
      <main>
        <Hero />
        <ProductSection products={products} />
        <PromoSection />
        <CollectionSection products={products} />
        <AboutSection />
        <FAQSection />
      </main>
      <Footer />
    </>
  );
}
