-- Create table for blocked time slots (specific hours on specific days)
CREATE TABLE public.blocked_time_slots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  blocked_date DATE NOT NULL,
  blocked_time TEXT NOT NULL,
  reason TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(blocked_date, blocked_time)
);

-- Enable Row Level Security
ALTER TABLE public.blocked_time_slots ENABLE ROW LEVEL SECURITY;

-- Anyone can view blocked time slots (needed for booking availability)
CREATE POLICY "Anyone can view blocked time slots"
ON public.blocked_time_slots
FOR SELECT
USING (true);

-- Only admins can create blocked time slots
CREATE POLICY "Admins can create blocked time slots"
ON public.blocked_time_slots
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete blocked time slots
CREATE POLICY "Admins can delete blocked time slots"
ON public.blocked_time_slots
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));