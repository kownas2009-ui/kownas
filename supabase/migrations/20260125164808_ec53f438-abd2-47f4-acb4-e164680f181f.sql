-- Create contact_messages table for user messages
CREATE TABLE public.contact_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_name TEXT NOT NULL,
  sender_email TEXT NOT NULL,
  sender_phone TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  admin_reply TEXT,
  replied_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Admins can view all messages
CREATE POLICY "Admins can view all messages"
ON public.contact_messages
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update messages (reply, mark read)
CREATE POLICY "Admins can update messages"
ON public.contact_messages
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete messages
CREATE POLICY "Admins can delete messages"
ON public.contact_messages
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Anyone can create messages (public contact form)
CREATE POLICY "Anyone can send messages"
ON public.contact_messages
FOR INSERT
WITH CHECK (true);

-- Create blocked_days table for admin to block specific days
CREATE TABLE public.blocked_days (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  blocked_date DATE NOT NULL UNIQUE,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.blocked_days ENABLE ROW LEVEL SECURITY;

-- Anyone can view blocked days (needed for booking calendar)
CREATE POLICY "Anyone can view blocked days"
ON public.blocked_days
FOR SELECT
USING (true);

-- Only admins can create blocked days
CREATE POLICY "Admins can create blocked days"
ON public.blocked_days
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete blocked days
CREATE POLICY "Admins can delete blocked days"
ON public.blocked_days
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));