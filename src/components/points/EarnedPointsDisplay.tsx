import { motion } from "framer-motion";
import { Sparkles, TrendingUp } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { calculatePointsEarned, getTierColor } from "@/utils/points";

/**
 * EarnedPointsDisplay - Shows points earned from order with celebration animation
 * Displays on success page
 */
interface EarnedPointsDisplayProps {
  orderAmount: number;
  tier: 'Bronze' | 'Silver' | 'Gold';
}

export const EarnedPointsDisplay = ({ orderAmount, tier }: EarnedPointsDisplayProps) => {
  const pointsEarned = calculatePointsEarned(orderAmount);
  const tierColor = getTierColor(tier);

  if (pointsEarned === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.1, type: "spring" }}
    >
      <GlassCard className="p-6 relative overflow-hidden">
        {/* Glow effect */}
        <motion.div
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 rounded-lg blur-xl"
          style={{ backgroundColor: tierColor }}
        />

        <div className="relative z-10 text-center">
          <motion.div
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="inline-block mb-3"
          >
            <Sparkles 
              className="w-8 h-8" 
              style={{ color: tierColor }}
            />
          </motion.div>

          <h3 className="text-lg font-heading font-bold mb-2">
            Kartly7 Points Earned!
          </h3>

          <div className="flex items-center justify-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <span 
              className="text-4xl font-heading font-bold"
              style={{ color: tierColor }}
            >
              +{pointsEarned}
            </span>
            <span className="text-muted-foreground">points</span>
          </div>

          <p className="text-sm text-muted-foreground">
            You earned {pointsEarned} Kartly7 Points from this ₹{orderAmount.toLocaleString()} order!
          </p>

          <div className="mt-4 p-3 rounded-lg bg-muted/20 text-xs text-muted-foreground">
            💡 Tip: 100 points = ₹10 discount on your next order
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
};
