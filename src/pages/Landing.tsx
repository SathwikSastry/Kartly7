import { lazy, Suspense } from "react";
import { CustomCursor } from "@/components/CustomCursor";
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { WhyKartly7 } from "@/components/WhyKartly7";
import { FeaturedProduct } from "@/components/FeaturedProduct";
import { SocialHandles } from "@/components/SocialHandles";
import { Footer } from "@/components/Footer";

const ParticleBackground = lazy(() => 
  import("@/components/ParticleBackground").then(module => ({ 
    default: module.ParticleBackground 
  }))
);

/**
 * Landing Page - Main entry point for Kartly7
 * Combines hero, brand story, featured product, and footer
 * Features particle background and custom cursor for immersive experience
 */
const Landing = () => {
  return (
    <div className="relative min-h-screen">
      <Suspense fallback={null}>
        <ParticleBackground />
      </Suspense>
      <CustomCursor />
      <Navigation />
      
      <main>
        <HeroSection />
        <FeaturedProduct />
        <WhyKartly7 />
        <SocialHandles />
      </main>

      <Footer />
    </div>
  );
};

export default Landing;
