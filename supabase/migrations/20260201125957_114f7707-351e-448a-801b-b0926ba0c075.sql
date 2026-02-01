-- Add email column to banned_users to block registration on banned emails
ALTER TABLE public.banned_users 
ADD COLUMN IF NOT EXISTS banned_email text;

-- Create index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_banned_users_email ON public.banned_users(banned_email);

-- Auto-cancel pending bookings older than 10 days
-- This will be handled by updating the cleanup edge function, but let's update existing old pending bookings now
UPDATE public.bookings 
SET status = 'cancelled' 
WHERE status = 'pending' 
  AND created_at < NOW() - INTERVAL '10 days';