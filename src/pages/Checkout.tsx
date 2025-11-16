import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlassCard } from "@/components/ui/glass-card";
import { Navigation } from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { RedeemPointsToggle } from "@/components/points/RedeemPointsToggle";
import { useUserPoints } from "@/hooks/useUserPoints";
import { calculatePointsEarned } from "@/utils/points";

/**
 * Checkout Page - Collects customer shipping information
 * Validates input and proceeds to payment page
 */
const Checkout = () => {
  const navigate = useNavigate();
  const { items, totalAmount } = useCart();
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);
  const { userPoints } = useUserPoints(userId);
  const [pointsDiscount, setPointsDiscount] = useState(0);
  const [pointsToRedeem, setPointsToRedeem] = useState(0);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<"online" | "cod">("online");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id || null);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check authentication first
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to continue with checkout",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    // Validate form
    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    // Validate phone (10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit phone number",
        variant: "destructive",
      });
      return;
    }

    // Store in session storage for payment page
    sessionStorage.setItem('checkout-data', JSON.stringify({
      ...formData,
      pointsDiscount,
      pointsToRedeem,
      paymentMethod,
    }));
    
    if (paymentMethod === 'cod') {
      toast({
        title: "COD Order Placed! 📦",
        description: "We verify all COD orders to make sure everything goes smoothly with delivery to your area. You'll hear from us by 7 PM with confirmation!",
        duration: 6000,
      });
    }
    
    navigate('/payment');
  };

  const finalAmount = totalAmount - pointsDiscount;
  const pointsWillEarn = calculatePointsEarned(finalAmount);

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
          Checkout
        </motion.h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <GlassCard className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your full name"
                    className="mt-2"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your.email@example.com"
                    className="mt-2"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                    placeholder="10-digit mobile number"
                    className="mt-2"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="address">Delivery Address *</Label>
                  <textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="House/Flat No., Street, Area, City, State, PIN Code"
                    className="mt-2 flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    rows={4}
                    required
                  />
                </div>

                {/* Payment Method Selection */}
                <div className="space-y-3">
                  <Label>Payment Method *</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("online")}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        paymentMethod === "online"
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="font-semibold">Online Payment</div>
                      <div className="text-sm text-muted-foreground mt-1">UPI / Card</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("cod")}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        paymentMethod === "cod"
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="font-semibold">Cash on Delivery</div>
                      <div className="text-sm text-muted-foreground mt-1">Pay at delivery</div>
                    </button>
                  </div>
                  {paymentMethod === "cod" && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-muted-foreground bg-accent/10 border border-accent/20 rounded-lg p-3"
                    >
                      ℹ️ We verify all COD orders to ensure smooth delivery to your area. You'll receive confirmation by 7 PM!
                    </motion.p>
                  )}
                </div>

                <Button type="submit" variant="hero" size="lg" className="w-full mt-6">
                  Continue to Payment
                </Button>
              </form>
            </GlassCard>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <GlassCard className="p-6 sticky top-24">
              <h2 className="text-xl font-heading font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.name} x {item.quantity}
                    </span>
                    <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="h-px bg-border mb-4" />
              
              <div className="flex justify-between text-lg mb-2">
                <span>Subtotal</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>

              {pointsDiscount > 0 && (
                <div className="flex justify-between text-lg text-green-400 mb-2">
                  <span>Points Discount</span>
                  <span>-₹{pointsDiscount.toFixed(2)}</span>
                </div>
              )}
              
              <div className="h-px bg-border mb-4" />

              <div className="flex justify-between text-xl font-bold mb-4">
                <span>Total</span>
                <span className="text-neon-gold">₹{finalAmount.toFixed(2)}</span>
              </div>

              {pointsWillEarn > 0 && (
                <div className="text-xs text-muted-foreground text-center p-2 rounded-lg bg-neon-cyan/10">
                  🎁 You'll earn {pointsWillEarn} Kartly7 Points from this order!
                </div>
              )}
            </GlassCard>

            {/* Points Redemption */}
            {userPoints && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-6"
              >
                <RedeemPointsToggle
                  availablePoints={userPoints.total_points}
                  tier={userPoints.tier}
                  orderAmount={totalAmount}
                  onRedemptionChange={(points, discount) => {
                    setPointsToRedeem(points);
                    setPointsDiscount(discount);
                  }}
                />
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
