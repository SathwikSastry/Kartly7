/**
 * Kartly7 Points System Utilities
 * 
 * Business Rules:
 * - Users earn 5 points for every ₹100 spent
 * - 100 points = ₹10 discount
 * - Tiers: Bronze (0-499), Silver (500-999), Gold (1000+)
 */

export interface UserPoints {
  id: string;
  user_id: string;
  total_points: number;
  tier: 'Bronze' | 'Silver' | 'Gold';
  updated_at: string;
}

export interface PointsTransaction {
  id: string;
  user_id: string;
  order_id: string | null;
  points_change: number;
  transaction_type: 'earned' | 'redeemed';
  description: string | null;
  created_at: string;
}

/**
 * Calculate points earned from order amount
 * @param orderAmount - Total order amount in ₹
 * @returns Points earned (5 points per ₹100)
 */
export const calculatePointsEarned = (orderAmount: number): number => {
  return Math.floor((orderAmount / 100) * 5);
};

/**
 * Calculate discount value from points
 * @param points - Number of points to redeem
 * @returns Discount amount in ₹ (100 points = ₹10)
 */
export const calculateDiscountFromPoints = (points: number): number => {
  return Math.floor(points / 100) * 10;
};

/**
 * Calculate points needed for a discount amount
 * @param discountAmount - Desired discount in ₹
 * @returns Points needed
 */
export const calculatePointsNeeded = (discountAmount: number): number => {
  return Math.ceil(discountAmount / 10) * 100;
};

/**
 * Get tier based on total points
 * @param points - Total points
 * @returns User tier
 */
export const getTier = (points: number): 'Bronze' | 'Silver' | 'Gold' => {
  if (points >= 1000) return 'Gold';
  if (points >= 500) return 'Silver';
  return 'Bronze';
};

/**
 * Get tier color for styling
 * @param tier - User tier
 * @returns HSL color string
 */
export const getTierColor = (tier: 'Bronze' | 'Silver' | 'Gold'): string => {
  switch (tier) {
    case 'Gold':
      return 'hsl(var(--neon-gold))';
    case 'Silver':
      return 'hsl(var(--neon-cyan))';
    case 'Bronze':
      return 'hsl(var(--accent))';
  }
};

/**
 * Get next tier threshold
 * @param currentPoints - Current total points
 * @returns Points needed for next tier, or null if already Gold
 */
export const getNextTierThreshold = (currentPoints: number): number | null => {
  if (currentPoints >= 1000) return null;
  if (currentPoints >= 500) return 1000;
  return 500;
};

/**
 * Calculate progress to next tier
 * @param currentPoints - Current total points
 * @returns Progress percentage (0-100)
 */
export const calculateTierProgress = (currentPoints: number): number => {
  if (currentPoints >= 1000) return 100;
  if (currentPoints >= 500) {
    // Progress from Silver to Gold (500-1000)
    return ((currentPoints - 500) / 500) * 100;
  }
  // Progress from Bronze to Silver (0-500)
  return (currentPoints / 500) * 100;
};

/**
 * Validate points redemption
 * @param pointsToRedeem - Points user wants to redeem
 * @param availablePoints - User's available points
 * @param orderAmount - Total order amount
 * @returns Validation result
 */
export const validateRedemption = (
  pointsToRedeem: number,
  availablePoints: number,
  orderAmount: number
): { valid: boolean; error?: string } => {
  if (pointsToRedeem < 0) {
    return { valid: false, error: 'Points cannot be negative' };
  }
  
  if (pointsToRedeem > availablePoints) {
    return { valid: false, error: 'Insufficient points available' };
  }
  
  if (pointsToRedeem < 100) {
    return { valid: false, error: 'Minimum 100 points required for redemption' };
  }
  
  const discount = calculateDiscountFromPoints(pointsToRedeem);
  if (discount > orderAmount) {
    return { valid: false, error: 'Discount cannot exceed order amount' };
  }
  
  return { valid: true };
};
