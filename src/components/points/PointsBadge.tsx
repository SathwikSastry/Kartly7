import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { getTierColor } from "@/utils/points";

/**
 * PointsBadge - Compact display of user's Kartly Points and tier
 * Shows total points with tier-based gradient glow
 */
interface PointsBadgeProps {
  totalPoints: number;
  tier: 'Bronze' | 'Silver' | 'Gold';
  showLabel?: boolean;
}

export const PointsBadge = ({ totalPoints, tier, showLabel = true }: PointsBadgeProps) => {
  const tierColor = getTierColor(tier);
  
  const tierGradients = {
    Bronze: 'from-accent/30 to-accent/10',
    Silver: 'from-neon-cyan/30 to-neon-cyan/10',
    Gold: 'from-neon-gold/30 to-neon-gold/10',
  };

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className={`relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${tierGradients[tier]} border border-current backdrop-blur-sm`}
      style={{ borderColor: tierColor }}
    >
      {/* Glow effect */}
      <div 
        className="absolute inset-0 rounded-full opacity-50 blur-md"
        style={{ backgroundColor: tierColor }}
      />
      
      <div className="relative flex items-center gap-2">
        <Sparkles 
          className="w-4 h-4" 
          style={{ color: tierColor }}
        />
        
        <div className="flex flex-col items-start">
          {showLabel && (
            <span className="text-xs text-muted-foreground">
              {tier} Tier
            </span>
          )}
          <span 
            className="font-heading font-bold text-sm"
            style={{ color: tierColor }}
          >
            {totalPoints.toLocaleString()} Points
          </span>
        </div>
      </div>
    </motion.div>
  );
};
