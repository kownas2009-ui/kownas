-- Add topic/section field for booking details
ALTER TABLE public.bookings 
ADD COLUMN topic text;