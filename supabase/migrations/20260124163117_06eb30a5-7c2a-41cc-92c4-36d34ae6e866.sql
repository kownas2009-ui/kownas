-- Add unique constraint to prevent double-booking
ALTER TABLE public.bookings 
ADD CONSTRAINT unique_booking_slot UNIQUE (booking_date, booking_time);

-- Create index for faster lookup of available slots
CREATE INDEX IF NOT EXISTS idx_bookings_date_time ON public.bookings(booking_date, booking_time);