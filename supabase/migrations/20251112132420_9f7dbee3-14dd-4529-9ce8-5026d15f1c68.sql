-- Add user_id column to orders table
ALTER TABLE public.orders ADD COLUMN user_id uuid REFERENCES auth.users(id);

-- Drop the insecure SELECT policy
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;

-- Create proper RLS policy for authenticated users to view only their orders
CREATE POLICY "Users can view their own orders" ON public.orders
  FOR SELECT
  USING (auth.uid() = user_id);

-- Update INSERT policy to require authentication and set user_id
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;
CREATE POLICY "Authenticated users can create orders" ON public.orders
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Make payment_screenshots bucket private
UPDATE storage.buckets 
SET public = false 
WHERE name = 'payment_screenshots';

-- Drop existing public storage policies if any
DROP POLICY IF EXISTS "Give users access to own folder" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload" ON storage.objects;

-- Create storage policies for authenticated users only
CREATE POLICY "Users can upload their own screenshots"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'payment_screenshots' AND
  auth.role() = 'authenticated' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own screenshots"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'payment_screenshots' AND
  auth.uid()::text = (storage.foldername(name))[1]
);