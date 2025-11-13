import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserPoints } from '@/utils/points';
import { useToast } from '@/hooks/use-toast';

/**
 * useUserPoints - Hook to fetch and manage user's Kartly7 Points
 * Automatically creates points record if it doesn't exist
 */
export const useUserPoints = (userId: string | null) => {
  const [userPoints, setUserPoints] = useState<UserPoints | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchUserPoints = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('user_points')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (!data) {
        // Create initial points record
        const { data: newData, error: insertError } = await supabase
          .from('user_points')
          .insert({
            user_id: userId,
            total_points: 0,
            tier: 'Bronze',
          })
          .select()
          .single();

        if (insertError) throw insertError;
        setUserPoints(newData as UserPoints);
      } else {
        setUserPoints(data as UserPoints);
      }
    } catch (err: any) {
      console.error('Error fetching user points:', err);
      setError(err.message);
      toast({
        title: 'Error loading points',
        description: 'Could not load your Kartly7 Points. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updatePoints = async (pointsToAdd: number, orderId?: string) => {
    if (!userId || !userPoints) return false;

    try {
      const newTotal = userPoints.total_points + pointsToAdd;

      // Update points
      const { error: updateError } = await supabase
        .from('user_points')
        .update({ total_points: newTotal })
        .eq('user_id', userId);

      if (updateError) throw updateError;

      // Record transaction
      const { error: transactionError } = await supabase
        .from('points_transactions')
        .insert({
          user_id: userId,
          order_id: orderId || null,
          points_change: pointsToAdd,
          transaction_type: pointsToAdd > 0 ? 'earned' : 'redeemed',
          description: pointsToAdd > 0 
            ? `Earned from order` 
            : `Redeemed ${Math.abs(pointsToAdd)} points`,
        });

      if (transactionError) throw transactionError;

      // Refresh points data
      await fetchUserPoints();
      return true;
    } catch (err: any) {
      console.error('Error updating points:', err);
      toast({
        title: 'Error updating points',
        description: err.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  useEffect(() => {
    fetchUserPoints();
  }, [userId]);

  return {
    userPoints,
    loading,
    error,
    refetch: fetchUserPoints,
    updatePoints,
  };
};
