-- Drop unused "Orders" table (capital O) which is a legacy duplicate
-- This table has RLS enabled but no policies and appears unused
-- The lowercase "orders" table is the actively used one with proper RLS policies
DROP TABLE IF EXISTS public."Orders" CASCADE;