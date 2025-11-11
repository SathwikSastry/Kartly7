import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ReactNode } from "react";

/**
 * GlassCard - Glassmorphic card component with optional 3D tilt effect
 * Provides the signature Kartly7 glass aesthetic with backdrop blur
 */
interface GlassCardProps {
  children: ReactNode;
  className?: string;
  tilt?: boolean;
  strong?: boolean;
  glow?: 'cyan' | 'purple' | 'magenta' | 'none';
}

export const GlassCard = ({ 
  children, 
  className, 
  tilt = false,
  strong = false,
  glow = 'none'
}: GlassCardProps) => {
  const glowClass = glow !== 'none' ? `glow-${glow}` : '';
  
  const cardContent = (
    <div className={cn(
      "rounded-lg p-6 transition-all duration-300",
      strong ? "glass-strong" : "glass",
      glowClass,
      className
    )}>
      {children}
    </div>
  );

  if (tilt) {
    return (
      <motion.div
        whileHover={{ scale: 1.02, rotateX: 5, rotateY: 5 }}
        transition={{ type: "spring", stiffness: 300 }}
        style={{ perspective: 1000 }}
      >
        {cardContent}
      </motion.div>
    );
  }

  return cardContent;
};
