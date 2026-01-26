-- Add new columns for enhanced booking information
ALTER TABLE public.bookings 
ADD COLUMN school_type text,
ADD COLUMN subject text,
ADD COLUMN level text,
ADD COLUMN class_number integer;

-- Add check constraints for valid values
ALTER TABLE public.bookings 
ADD CONSTRAINT valid_school_type CHECK (school_type IN ('podstawowa', 'liceum', 'technikum')),
ADD CONSTRAINT valid_subject CHECK (subject IN ('chemia', 'fizyka')),
ADD CONSTRAINT valid_level CHECK (level IN ('podstawowy', 'rozszerzony'));