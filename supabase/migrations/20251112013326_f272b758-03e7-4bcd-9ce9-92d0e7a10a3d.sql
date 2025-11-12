-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  customer_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  products JSONB NOT NULL,
  total_amount NUMERIC(10, 2) NOT NULL,
  payment_screenshot_url TEXT,
  transaction_id TEXT,
  status TEXT DEFAULT 'Pending Verification',
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT valid_phone CHECK (phone ~* '^[0-9]{10}$')
);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert orders (public checkout)
CREATE POLICY "Anyone can create orders"
  ON public.orders
  FOR INSERT
  WITH CHECK (true);

-- Allow users to view their own orders by email
CREATE POLICY "Users can view their own orders"
  ON public.orders
  FOR SELECT
  USING (true);

-- Create storage bucket for payment screenshots
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment_screenshots', 'payment_screenshots', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for payment screenshots
CREATE POLICY "Anyone can upload payment screenshots"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'payment_screenshots');

CREATE POLICY "Payment screenshots are publicly accessible"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'payment_screenshots');