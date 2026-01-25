-- Add payment tracking column to bookings table
ALTER TABLE public.bookings 
ADD COLUMN is_paid BOOLEAN NOT NULL DEFAULT false;