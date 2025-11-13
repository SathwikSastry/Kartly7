import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/Navigation";
import { PointsSummaryCard } from "@/components/points/PointsSummaryCard";
import { PointsBadge } from "@/components/points/PointsBadge";
import { GlassCard } from "@/components/ui/glass-card";
import { supabase } from "@/integrations/supabase/client";
import { useUserPoints } from "@/hooks/useUserPoints";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

/**
 * Profile Page - User profile with Kartly7 Points dashboard
 * Displays points summary, tier progress, and transaction history
 */
const Profile = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const { userPoints, loading } = useUserPoints(userId);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/auth');
        return;
      }
      setUserId(session.user.id);
      setUserEmail(session.user.email || null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Navigation />
      
      <div className="container max-w-5xl mx-auto px-4 pt-32 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-gradient-cosmic">
                My Profile
              </h1>
              <p className="text-muted-foreground mt-2">
                {userEmail}
              </p>
            </div>
            
            {userPoints && (
              <PointsBadge 
                totalPoints={userPoints.total_points} 
                tier={userPoints.tier}
              />
            )}
          </div>
        </motion.div>

        {/* Points Summary */}
        {userPoints ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <PointsSummaryCard 
              totalPoints={userPoints.total_points}
              tier={userPoints.tier}
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <GlassCard className="p-8 text-center">
              <p className="text-muted-foreground">
                Loading your Kartly7 Points...
              </p>
            </GlassCard>
          </motion.div>
        )}

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <GlassCard className="p-8">
            <h2 className="text-2xl font-heading font-bold mb-6">
              How Kartly7 Points Work
            </h2>
            
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg text-primary">
                    ✨ Earn Points
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Get 5 points for every ₹100 you spend on verified orders at Kartly7
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-lg text-primary">
                    🎁 Redeem Points
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Use 100 points to get ₹10 off on your next purchase
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-lg text-primary">
                    🥉 Bronze Tier (0-499 points)
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Start earning rewards with every purchase
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-lg text-primary">
                    🥈 Silver Tier (500-999 points)
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Enhanced rewards and exclusive perks
                  </p>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <h3 className="font-semibold text-lg text-primary">
                    🥇 Gold Tier (1000+ points)
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Premium member benefits and maximum rewards
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-border/50">
                <p className="text-xs text-muted-foreground text-center">
                  Points are automatically calculated and added to your account after order verification.
                  Redeemed points are deducted at checkout.
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
