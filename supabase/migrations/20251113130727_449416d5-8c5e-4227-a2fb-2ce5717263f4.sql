-- ============================================
-- KARTLY7 SECURITY AUDIT FIX
-- Fix critical RLS policy gaps and data protection
-- ============================================

-- 1. ORDERS TABLE: Prevent unauthorized modifications
-- Users should NEVER be able to modify or delete orders after submission
-- Only service roles (admin backend) should handle order updates

CREATE POLICY "Orders cannot be modified by users"
ON public.orders
FOR UPDATE
TO authenticated
USING (false);

CREATE POLICY "Orders cannot be deleted by users"
ON public.orders
FOR DELETE
TO authenticated
USING (false);

-- 2. PRODUCTS TABLE: Lock down product catalog
-- Only service roles should manage products
-- Regular users can only view active products (already has SELECT policy)

CREATE POLICY "Products cannot be inserted by users"
ON public.products
FOR INSERT
TO authenticated
WITH CHECK (false);

CREATE POLICY "Products cannot be updated by users"
ON public.products
FOR UPDATE
TO authenticated
USING (false);

CREATE POLICY "Products cannot be deleted by users"
ON public.products
FOR DELETE
TO authenticated
USING (false);

-- 3. USER_POINTS TABLE: Prevent accidental deletion
-- Points records are permanent and should never be deleted by users

CREATE POLICY "User points cannot be deleted"
ON public.user_points
FOR DELETE
TO authenticated
USING (false);

-- 4. POINTS_TRANSACTIONS TABLE: Make transaction log immutable
-- Transaction history should be append-only for audit trail integrity

CREATE POLICY "Transactions cannot be modified"
ON public.points_transactions
FOR UPDATE
TO authenticated
USING (false);

CREATE POLICY "Transactions cannot be deleted"
ON public.points_transactions
FOR DELETE
TO authenticated
USING (false);

-- 5. STORAGE BUCKET: Make payment screenshots private
-- Update the payment_screenshots bucket to require authentication
UPDATE storage.buckets
SET public = false
WHERE id = 'payment_screenshots';

-- 6. STORAGE POLICIES: Restrict access to payment screenshots
-- Only allow users to upload their own screenshots
-- Only allow users to view their own screenshots

-- Drop existing permissive policies if any exist
DROP POLICY IF EXISTS "Anyone can upload payment screenshots" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view payment screenshots" ON storage.objects;

-- Create secure policies for payment screenshots bucket
CREATE POLICY "Users can upload their own payment screenshots"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'payment_screenshots' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own payment screenshots"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'payment_screenshots' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users cannot update payment screenshots"
ON storage.objects
FOR UPDATE
TO authenticated
USING (false);

CREATE POLICY "Users cannot delete payment screenshots"
ON storage.objects
FOR DELETE
TO authenticated
USING (false);