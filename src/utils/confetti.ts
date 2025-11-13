import { useEffect } from "react";
import confetti from "canvas-confetti";

/**
 * TierUpgradeConfetti - Triggers confetti animation when user upgrades tier
 */
export const triggerTierUpgradeConfetti = (tier: 'Silver' | 'Gold') => {
  const colors = tier === 'Gold' 
    ? ['#FFD700', '#FFA500', '#FF6347'] // Gold colors
    : ['#00FFFF', '#4169E1', '#9370DB']; // Silver/Cyan colors

  const duration = 3000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  const interval: NodeJS.Timeout = setInterval(function() {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);

    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      colors,
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      colors,
    });
  }, 250);
};

/**
 * useConfettiOnTierUpgrade - Hook to automatically trigger confetti on tier upgrade
 */
export const useConfettiOnTierUpgrade = (
  currentPoints: number, 
  previousPoints: number,
  tier: 'Bronze' | 'Silver' | 'Gold'
) => {
  useEffect(() => {
    // Check if crossed Silver threshold (500)
    if (previousPoints < 500 && currentPoints >= 500 && tier === 'Silver') {
      setTimeout(() => triggerTierUpgradeConfetti('Silver'), 500);
    }
    
    // Check if crossed Gold threshold (1000)
    if (previousPoints < 1000 && currentPoints >= 1000 && tier === 'Gold') {
      setTimeout(() => triggerTierUpgradeConfetti('Gold'), 500);
    }
  }, [currentPoints, previousPoints, tier]);
};
