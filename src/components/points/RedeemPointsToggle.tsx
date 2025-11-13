import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Info } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  calculateDiscountFromPoints, 
  validateRedemption,
  getTierColor 
} from "@/utils/points";

/**
 * RedeemPointsToggle - Component for redeeming points during checkout
 * Allows users to apply points as discount with validation
 */
interface RedeemPointsToggleProps {
  availablePoints: number;
  tier: 'Bronze' | 'Silver' | 'Gold';
  orderAmount: number;
  onRedemptionChange: (pointsToRedeem: number, discountAmount: number) => void;
}

export const RedeemPointsToggle = ({ 
  availablePoints, 
  tier,
  orderAmount, 
  onRedemptionChange 
}: RedeemPointsToggleProps) => {
  const [redeemEnabled, setRedeemEnabled] = useState(false);
  const [pointsToRedeem, setPointsToRedeem] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const tierColor = getTierColor(tier);
  const maxRedeemablePoints = Math.min(
    availablePoints,
    Math.floor(orderAmount / 10) * 100 // Can't redeem more than order amount
  );

  const handleToggle = (enabled: boolean) => {
    setRedeemEnabled(enabled);
    if (!enabled) {
      setPointsToRedeem(0);
      setError(null);
      onRedemptionChange(0, 0);
    } else {
      // Auto-suggest maximum redeemable points
      const suggestedPoints = Math.floor(maxRedeemablePoints / 100) * 100;
      handlePointsChange(suggestedPoints);
    }
  };

  const handlePointsChange = (points: number) => {
    setPointsToRedeem(points);
    
    const validation = validateRedemption(points, availablePoints, orderAmount);
    
    if (!validation.valid) {
      setError(validation.error || null);
      onRedemptionChange(0, 0);
    } else {
      setError(null);
      const discount = calculateDiscountFromPoints(points);
      onRedemptionChange(points, discount);
    }
  };

  const discountAmount = error ? 0 : calculateDiscountFromPoints(pointsToRedeem);

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5" style={{ color: tierColor }} />
          <div>
            <Label htmlFor="redeem-points" className="text-base font-semibold cursor-pointer">
              Use Kartly7 Points
            </Label>
            <p className="text-xs text-muted-foreground">
              {availablePoints.toLocaleString()} points available
            </p>
          </div>
        </div>
        
        <Switch
          id="redeem-points"
          checked={redeemEnabled}
          onCheckedChange={handleToggle}
          disabled={availablePoints < 100}
        />
      </div>

      <AnimatePresence>
        {redeemEnabled && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="space-y-4 pt-4 border-t border-border/50">
              {/* Points Input */}
              <div>
                <Label htmlFor="points-input" className="text-sm mb-2 block">
                  Points to Redeem (multiples of 100)
                </Label>
                <Input
                  id="points-input"
                  type="number"
                  min={100}
                  max={maxRedeemablePoints}
                  step={100}
                  value={pointsToRedeem}
                  onChange={(e) => handlePointsChange(Number(e.target.value))}
                  className="glass"
                />
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-sm text-destructive"
                >
                  <Info className="w-4 h-4" />
                  <span>{error}</span>
                </motion.div>
              )}

              {/* Discount Preview */}
              {!error && pointsToRedeem > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-lg bg-gradient-to-r from-neon-cyan/10 to-neon-purple/10 border border-neon-cyan/30"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Discount Applied:</span>
                    <span 
                      className="text-2xl font-heading font-bold"
                      style={{ color: tierColor }}
                    >
                      -₹{discountAmount}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Using {pointsToRedeem.toLocaleString()} points
                  </p>
                </motion.div>
              )}

              {/* Info Box */}
              <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/20 text-xs text-muted-foreground">
                <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p>100 points = ₹10 discount</p>
                  <p>Minimum 100 points required for redemption</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {availablePoints < 100 && (
        <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
          <Info className="w-3 h-3" />
          Need at least 100 points to redeem
        </p>
      )}
    </GlassCard>
  );
};
