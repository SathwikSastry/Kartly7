import { ParticleBackground } from "@/components/ParticleBackground";
import { CustomCursor } from "@/components/CustomCursor";
import { HeroSection } from "@/components/HeroSection";
import { WhyKartly7 } from "@/components/WhyKartly7";
import { FeaturedProduct } from "@/components/FeaturedProduct";
import { Footer } from "@/components/Footer";

/**
 * Landing Page - Main entry point for Kartly7
 * Combines hero, brand story, featured product, and footer
 * Features particle background and custom cursor for immersive experience
 */
const Landing = () => {
  return (
    <div className="relative min-h-screen">
      <ParticleBackground />
      <CustomCursor />
      
      <main>
        <HeroSection />
        <WhyKartly7 />
        <FeaturedProduct />
      </main>

      <Footer />
    </div>
  );
};

export default Landing;
