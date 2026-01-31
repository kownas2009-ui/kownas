-- Add banned_users table for tracking banned users
CREATE TABLE public.banned_users (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE,
    banned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    banned_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    reason TEXT
);

-- Enable RLS
ALTER TABLE public.banned_users ENABLE ROW LEVEL SECURITY;

-- Only admins can manage banned users
CREATE POLICY "Admins can view banned users"
ON public.banned_users
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can ban users"
ON public.banned_users
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can unban users"
ON public.banned_users
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Add column to contact_messages to track who sent the last message
ALTER TABLE public.contact_messages 
ADD COLUMN IF NOT EXISTS last_sender_type TEXT DEFAULT 'student';

-- Add comment for documentation
COMMENT ON COLUMN public.contact_messages.last_sender_type IS 'Tracks who sent the last message: student or admin';