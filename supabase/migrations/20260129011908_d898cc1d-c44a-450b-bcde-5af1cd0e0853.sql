-- Drop the existing unique constraint that blocks ALL duplicates (including cancelled)
ALTER TABLE public.bookings DROP CONSTRAINT IF EXISTS unique_booking_slot;

-- Create a partial unique index that ONLY enforces uniqueness for active bookings (pending/confirmed)
-- This allows re-booking a slot that was previously cancelled
CREATE UNIQUE INDEX unique_active_booking_slot 
ON public.bookings (booking_date, booking_time) 
WHERE status IN ('pending', 'confirmed');