import { useState } from "react";
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please upload an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }
      setScreenshot(file);
    }
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
      let screenshotUrl = null;

      // Upload screenshot if provided
      if (screenshot) {
        const fileExt = screenshot.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('payment_screenshots')
          .upload(fileName, screenshot);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('payment_screenshots')
          .getPublicUrl(fileName);
        
        screenshotUrl = publicUrl;
      }

      // Insert order into database
      const { error: insertError } = await supabase
        .from('orders')
        .insert([{
          customer_name: customerInfo.name,
          email: customerInfo.email,
          phone: customerInfo.phone,
          address: customerInfo.address,
          products: items as any,
          total_amount: totalAmount,
          payment_screenshot_url: screenshotUrl,
          transaction_id: transactionId || null,
          status: 'Pending Verification',
        }]);

      if (insertError) throw insertError;

      // Clear cart and checkout data
      clearCart();
      sessionStorage.removeItem('checkout-data');
      
      navigate('/success');
    } catch (error: any) {
      console.error('Order submission error:', error);
      toast({
        title: "Order Submission Failed",
        description: error.message || "Please try again later",
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
                <li>Make payment of <span className="text-neon-gold font-bold">₹{totalAmount.toFixed(2)}</span> to our UPI ID</li>
                <li>Take a screenshot of the successful transaction</li>
                <li>Upload the screenshot below OR enter your transaction ID</li>
              </ol>
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
