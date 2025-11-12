import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";

interface GoldenStarAnimationProps {
  startPosition: { x: number; y: number };
  endPosition: { x: number; y: number };
  onComplete: () => void;
}

/**
 * GoldenStarAnimation - Animated golden star that flies from Add to Cart button to cart icon
 * Uses Framer Motion path animation for smooth trajectory
 */
export const GoldenStarAnimation: React.FC<GoldenStarAnimationProps> = ({
  startPosition,
  endPosition,
  onComplete,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, 1000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{
        position: "fixed",
        left: startPosition.x,
        top: startPosition.y,
        scale: 1,
        opacity: 1,
      }}
      animate={{
        left: endPosition.x,
        top: endPosition.y,
        scale: 0.5,
        opacity: 0,
      }}
      transition={{
        duration: 1,
        ease: "easeInOut",
      }}
      className="pointer-events-none z-[100]"
    >
      <Star className="w-8 h-8 text-neon-gold fill-neon-gold animate-pulse" style={{ filter: "drop-shadow(0 0 10px #FFD700)" }} />
    </motion.div>
  );
};
