-- Create user_points table for Kartly7 Points reward system
CREATE TABLE public.user_points (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  total_points INTEGER NOT NULL DEFAULT 0 CHECK (total_points >= 0),
  tier TEXT NOT NULL DEFAULT 'Bronze',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_points ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own points"
ON public.user_points
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own points"
ON public.user_points
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own points"
ON public.user_points
FOR UPDATE
USING (auth.uid() = user_id);

-- Create function to automatically update tier based on points
CREATE OR REPLACE FUNCTION public.update_user_tier()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.total_points >= 1000 THEN
    NEW.tier := 'Gold';
  ELSIF NEW.total_points >= 500 THEN
    NEW.tier := 'Silver';
  ELSE
    NEW.tier := 'Bronze';
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

-- Create trigger to automatically update tier when points change
CREATE TRIGGER update_tier_on_points_change
BEFORE INSERT OR UPDATE ON public.user_points
FOR EACH ROW
EXECUTE FUNCTION public.update_user_tier();

-- Create index for faster lookups
CREATE INDEX idx_user_points_user_id ON public.user_points(user_id);

-- Create points_transactions table to track point earning/spending history
CREATE TABLE public.points_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  order_id UUID REFERENCES public.orders(id),
  points_change INTEGER NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('earned', 'redeemed')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for points_transactions
ALTER TABLE public.points_transactions ENABLE ROW LEVEL SECURITY;

-- RLS policies for points_transactions
CREATE POLICY "Users can view their own transactions"
ON public.points_transactions
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions"
ON public.points_transactions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create index for faster transaction lookups
CREATE INDEX idx_points_transactions_user_id ON public.points_transactions(user_id);
CREATE INDEX idx_points_transactions_order_id ON public.points_transactions(order_id);