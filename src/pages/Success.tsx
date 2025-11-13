import { motion } from "framer-motion";
import { CheckCircle, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUserPoints } from "@/hooks/useUserPoints";
import { EarnedPointsDisplay } from "@/components/points/EarnedPointsDisplay";

/**
 * Success Page - Order confirmation with celebration animation
 * Shows thank you message and option to continue shopping
 */
const Success = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const { userPoints } = useUserPoints(userId);
  const [orderAmount, setOrderAmount] = useState(0);
  const [pointsEarned, setPointsEarned] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Get user ID
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id || null);
    });

    // Retrieve order data from sessionStorage
    const amount = parseFloat(sessionStorage.getItem('order-total') || '0');
    const earned = parseInt(sessionStorage.getItem('points-earned') || '0', 10);
    
    setOrderAmount(amount);
    setPointsEarned(earned);
  }, []);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center px-4">
      {/* Animated background particles */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 100 }}
            animate={{
              opacity: [0, 1, 0],
              y: [-100, -500],
              x: Math.random() * window.innerWidth,
            }}
            transition={{
              duration: 3,
              delay: i * 0.2,
              repeat: Infinity,
              repeatDelay: 5,
            }}
            className="absolute"
          >
            <Sparkles className="w-6 h-6 text-neon-gold" />
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-2xl w-full"
      >
        <GlassCard className="p-12 text-center">
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="mb-8"
          >
            <CheckCircle className="w-24 h-24 mx-auto text-green-400" style={{ filter: "drop-shadow(0 0 20px rgba(34, 197, 94, 0.5))" }} />
          </motion.div>

          {/* Success Message */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-4xl md:text-5xl font-heading font-bold mb-6 text-gradient-cosmic"
          >
            Order Placed Successfully!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-xl text-muted-foreground mb-8"
          >
            Thank you for choosing Kartly7! Your order has been received and is being processed.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="space-y-4"
          >
            <div className="glass-card p-6 mb-8">
              <p className="text-muted-foreground">
                We've sent a confirmation email with your order details. Our team will verify your payment and process your order shortly.
              </p>
            </div>

            {/* Points Earned Display */}
            {pointsEarned > 0 && userPoints && (
              <div className="mb-8">
                <EarnedPointsDisplay 
                  orderAmount={orderAmount}
                  tier={userPoints.tier}
                />
              </div>
            )}

            <Link to="/">
              <Button variant="hero" size="lg" className="w-full sm:w-auto">
                Continue Shopping
              </Button>
            </Link>
          </motion.div>

          {/* Decorative elements */}
          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute top-4 right-4 opacity-20"
          >
            <Sparkles className="w-12 h-12 text-neon-purple" />
          </motion.div>
          
          <motion.div
            animate={{
              rotate: -360,
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute bottom-4 left-4 opacity-20"
          >
            <Sparkles className="w-12 h-12 text-neon-cyan" />
          </motion.div>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default Success;
