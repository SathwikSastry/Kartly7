import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Upload, Loader2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlassCard } from "@/components/ui/glass-card";
import { Navigation } from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

/**
 * Payment Page - UPI payment verification
 * Allows users to upload payment screenshot or enter transaction ID
 */
const Payment = () => {
  const navigate = useNavigate();
  const { items, totalAmount, clearCart } = useCart();
  const { toast } = useToast();
  
  const [transactionId, setTransactionId] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pointsDiscount, setPointsDiscount] = useState(0);
  const [pointsToRedeem, setPointsToRedeem] = useState(0);

  useEffect(() => {
    // Get points discount from checkout data
    const checkoutData = sessionStorage.getItem('checkout-data');
    if (checkoutData) {
      const data = JSON.parse(checkoutData);
      setPointsDiscount(data.pointsDiscount || 0);
      setPointsToRedeem(data.pointsToRedeem || 0);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file size
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }
    
    // Validate MIME type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Only JPG, PNG, and WEBP images are allowed",
        variant: "destructive",
      });
      return;
    }
    
    setScreenshot(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!transactionId && !screenshot) {
      toast({
        title: "Payment Verification Required",
        description: "Please provide either a transaction ID or upload a payment screenshot",
        variant: "destructive",
      });
      return;
    }

    const checkoutData = sessionStorage.getItem('checkout-data');
    if (!checkoutData) {
      navigate('/checkout');
      return;
    }

    const customerInfo = JSON.parse(checkoutData);
    setIsSubmitting(true);

    try {
      // Check authentication
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to place an order",
          variant: "destructive",
        });
        navigate('/auth');
        return;
      }

      let screenshotPath = null;

      // Upload screenshot if provided
      if (screenshot) {
        const fileExt = screenshot.name.split('.').pop();
        const userId = session.user.id;
        const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('payment_screenshots')
          .upload(fileName, screenshot);

        if (uploadError) throw uploadError;
        
        screenshotPath = fileName;
      }

      const finalAmount = totalAmount - pointsDiscount;
      
      // Submit order via edge function with server-side validation
      const { data, error } = await supabase.functions.invoke('submit-order', {
        body: {
          customer_name: customerInfo.name,
          email: customerInfo.email,
          phone: customerInfo.phone,
          address: customerInfo.address,
          products: items.map(item => ({ id: item.id, quantity: item.quantity })),
          points_to_redeem: pointsToRedeem,
          screenshot_path: screenshotPath,
          transaction_id: transactionId || null,
        }
      });

      if (error) throw error;

      // Store order details for success page
      sessionStorage.setItem('order-total', finalAmount.toString());
      sessionStorage.setItem('points-earned', data.points_earned?.toString() || '0');
      sessionStorage.setItem('points-redeemed', data.points_redeemed?.toString() || '0');

      // Clear cart and checkout data
      clearCart();
      sessionStorage.removeItem('checkout-data');
      
      navigate('/success');
    } catch (error: any) {
      toast({
        title: "Order Submission Failed",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Navigation />
      
      <div className="container max-w-4xl mx-auto px-4 pt-32 pb-20">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-heading font-bold mb-12 text-gradient-cosmic"
        >
          Payment Verification
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <GlassCard className="p-8 mb-8">
            <h2 className="text-2xl font-heading font-bold mb-6">UPI Payment Instructions</h2>
            
            <div className="space-y-4 mb-8 text-muted-foreground">
              <p>Please complete the payment using UPI and provide verification details:</p>
              <ol className="list-decimal list-inside space-y-2">
                <li>Make payment of <span className="text-neon-gold font-bold">₹{(totalAmount - pointsDiscount).toFixed(2)}</span> to our UPI ID</li>
                <li>Take a screenshot of the successful transaction</li>
                <li>Upload the screenshot below OR enter your transaction ID</li>
              </ol>
              {pointsDiscount > 0 && (
                <p className="text-sm text-green-400">
                  ✨ Kartly7 Points discount of ₹{pointsDiscount.toFixed(2)} has been applied!
                </p>
              )}
              <p className="text-sm italic">PhonePe payment link will be integrated soon for direct checkout.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="transactionId">UPI Transaction ID (Optional)</Label>
                <Input
                  id="transactionId"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="Enter 12-digit transaction ID"
                  className="mt-2"
                />
              </div>

              <div className="text-center text-muted-foreground">OR</div>

              <div>
                <Label htmlFor="screenshot">Upload Payment Screenshot (Optional)</Label>
                <div className="mt-2">
                  <label
                    htmlFor="screenshot"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors"
                  >
                    <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {screenshot ? screenshot.name : "Click to upload payment screenshot"}
                    </span>
                    <span className="text-xs text-muted-foreground mt-1">Max 5MB</span>
                  </label>
                  <input
                    id="screenshot"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                variant="hero" 
                size="lg" 
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing Order...
                  </>
                ) : (
                  "Submit Order"
                )}
              </Button>
            </form>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

export default Payment;
