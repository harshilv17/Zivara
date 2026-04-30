import { Hero } from "@/components/Hero";
import { ProductGrid } from "@/components/ProductGrid";
import { Features } from "@/components/Features";
import { Testimonials } from "@/components/Testimonials";
import { BrandShowcase } from "@/components/BrandShowcase";
import { StatsSection, CollectionsGrid, InstagramSection, NewsletterSection } from "@/components/EnhancedSections";

export default function Home() {
  return (
    <>
      <Hero />
      <BrandShowcase />
      <ProductGrid />
      <CollectionsGrid />
      <Features />
      <StatsSection />
      <Testimonials />
      <InstagramSection />
      <NewsletterSection />
      
      {/* Brand Story Section */}
      <section className="py-24 bg-gradient-to-br from-[#5a7c65] via-[#4a6652] to-[#3a5642] text-white text-center relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#d4a373]/10 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 max-w-2xl relative z-10">
          <h2 className="text-3xl md:text-5xl font-serif mb-6">Welcome to our world</h2>
          <p className="text-lg opacity-90 mb-10 leading-relaxed font-light">
            We believe in bags that are more than just accessories. They are companions that hold your world together while you conquer yours.
          </p>
          <a 
            href="/about" 
            className="inline-block border border-white px-8 py-3 text-sm font-medium tracking-widest hover:bg-white hover:text-[#5a7c65] transition-all duration-300 hover:scale-105"
          >
            READ OUR STORY
          </a>
        </div>
      </section>
    </>
  );
}

