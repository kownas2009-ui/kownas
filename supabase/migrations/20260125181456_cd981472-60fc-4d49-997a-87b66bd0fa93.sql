-- Add unique constraint on phone number in profiles table
-- First, update any NULL phones to prevent constraint issues
-- Then add unique constraint

-- Create unique index on phone (only for non-null values)
CREATE UNIQUE INDEX IF NOT EXISTS profiles_phone_unique_idx ON public.profiles (phone) WHERE phone IS NOT NULL AND phone != '';