-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Anyone can send messages" ON public.contact_messages;

-- Create a more secure policy that still allows public contact form submissions
-- but adds basic validation through the policy
CREATE POLICY "Public contact form submissions" 
ON public.contact_messages 
FOR INSERT 
WITH CHECK (
  -- Ensure required fields are not empty
  sender_name IS NOT NULL AND 
  sender_name <> '' AND
  sender_email IS NOT NULL AND 
  sender_email <> '' AND
  message IS NOT NULL AND 
  message <> '' AND
  -- Ensure new messages start with proper defaults
  is_read = false AND
  admin_reply IS NULL AND
  replied_at IS NULL
);