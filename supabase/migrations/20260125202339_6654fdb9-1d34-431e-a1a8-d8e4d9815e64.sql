-- Allow users to view their own messages (by matching email)
CREATE POLICY "Users can view their own messages"
ON public.contact_messages
FOR SELECT
USING (sender_email = (SELECT email FROM auth.users WHERE id = auth.uid()));