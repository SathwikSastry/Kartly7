import { motion } from "framer-motion";
import { Sparkles, TrendingUp } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Progress } from "@/components/ui/progress";
import { 
  calculateTierProgress, 
  getNextTierThreshold, 
  getTierColor,
  calculateDiscountFromPoints 
} from "@/utils/points";

/**
 * PointsSummaryCard - Detailed view of user's points, tier, and progress
 * Displays on profile/dashboard pages with tier progress bar
 */
interface PointsSummaryCardProps {
  totalPoints: number;
  tier: 'Bronze' | 'Silver' | 'Gold';
}

export const PointsSummaryCard = ({ totalPoints, tier }: PointsSummaryCardProps) => {
  const tierColor = getTierColor(tier);
  const progress = calculateTierProgress(totalPoints);
  const nextThreshold = getNextTierThreshold(totalPoints);
  const discountValue = calculateDiscountFromPoints(totalPoints);

  const tierDescriptions = {
    Bronze: 'Welcome to Kartly7 Rewards!',
    Silver: 'You\'re earning great rewards!',
    Gold: 'Premium member - Maximum benefits!',
  };

  return (
    <GlassCard className="p-6 relative overflow-hidden">
      {/* Animated background glow */}
      <motion.div
        animate={{
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-30"
        style={{ backgroundColor: tierColor }}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-heading font-bold mb-1">
              Kartly7 Points
            </h3>
            <p className="text-sm text-muted-foreground">
              {tierDescriptions[tier]}
            </p>
          </div>
          <Sparkles className="w-8 h-8" style={{ color: tierColor }} />
        </div>

        {/* Points Display */}
        <div className="mb-6">
          <div className="flex items-baseline gap-2 mb-2">
            <span 
              className="text-5xl font-heading font-bold"
              style={{ color: tierColor }}
            >
              {totalPoints.toLocaleString()}
            </span>
            <span className="text-muted-foreground">points</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="w-4 h-4" />
            <span>Worth ₹{discountValue} in discounts</span>
          </div>
        </div>

        {/* Tier Badge */}
        <div className="mb-4">
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm"
            style={{ 
              backgroundColor: `${tierColor}20`,
              color: tierColor,
              border: `2px solid ${tierColor}40`
            }}
          >
            <Sparkles className="w-4 h-4" />
            <span>{tier} Tier</span>
          </div>
        </div>

        {/* Progress to Next Tier */}
        {nextThreshold && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Progress to {tier === 'Bronze' ? 'Silver' : 'Gold'} Tier
              </span>
              <span className="font-semibold" style={{ color: tierColor }}>
                {Math.round(progress)}%
              </span>
            </div>
            
            <Progress 
              value={progress} 
              className="h-2"
              style={{
                '--progress-color': tierColor,
              } as React.CSSProperties}
            />
            
            <p className="text-xs text-muted-foreground">
              {nextThreshold - totalPoints} points to next tier
            </p>
          </div>
        )}

        {tier === 'Gold' && (
          <div className="text-sm text-center p-3 rounded-lg bg-gradient-to-r from-neon-gold/20 to-neon-gold/10 border border-neon-gold/30">
            🎉 You've reached the highest tier!
          </div>
        )}

        {/* How to Earn */}
        <div className="mt-6 pt-6 border-t border-border/50">
          <p className="text-xs text-muted-foreground">
            <strong>Earn Points:</strong> Get 5 points for every ₹100 spent<br />
            <strong>Redeem:</strong> 100 points = ₹10 discount
          </p>
        </div>
      </div>
    </GlassCard>
  );
};
