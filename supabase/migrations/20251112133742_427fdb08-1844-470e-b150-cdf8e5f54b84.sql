-- Fix 1: Remove insecure legacy storage policies
DROP POLICY IF EXISTS "Anyone can upload payment screenshots" ON storage.objects;
DROP POLICY IF EXISTS "Payment screenshots are publicly accessible" ON storage.objects;

-- Fix 2: Add MIME type restrictions and file size limits to storage bucket
UPDATE storage.buckets 
SET allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'],
    file_size_limit = 5242880  -- 5MB in bytes
WHERE name = 'payment_screenshots';

-- Fix 3: Delete any orders with NULL user_id (if any) before adding constraint
DELETE FROM orders WHERE user_id IS NULL;

-- Now make user_id NOT NULL
ALTER TABLE orders 
ALTER COLUMN user_id SET NOT NULL;

-- Add foreign key constraint only if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'orders_user_id_fkey'
    ) THEN
        ALTER TABLE orders
        ADD CONSTRAINT orders_user_id_fkey 
        FOREIGN KEY (user_id) 
        REFERENCES auth.users(id) 
        ON DELETE CASCADE;
    END IF;
END $$;