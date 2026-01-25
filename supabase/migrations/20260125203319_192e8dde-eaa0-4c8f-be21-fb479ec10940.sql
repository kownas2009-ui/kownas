-- Drop the problematic policy
DROP POLICY IF EXISTS "Users can view their own messages" ON public.contact_messages;

-- Create a security definer function to get user email
CREATE OR REPLACE FUNCTION public.get_user_email(_user_id uuid)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT email FROM auth.users WHERE id = _user_id
$$;

-- Recreate the policy using the function
CREATE POLICY "Users can view their own messages"
ON public.contact_messages
FOR SELECT
USING (sender_email = public.get_user_email(auth.uid()));

-- Allow admins to insert messages (for sending new messages to students)
CREATE POLICY "Admins can insert messages"
ON public.contact_messages
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));