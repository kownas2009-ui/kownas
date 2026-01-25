-- Add column to track if student has read the admin reply
ALTER TABLE public.contact_messages 
ADD COLUMN IF NOT EXISTS student_read_reply boolean NOT NULL DEFAULT true;

-- Allow students to update their own messages (for appending replies and marking as read)
CREATE POLICY "Students can update their own messages"
ON public.contact_messages
FOR UPDATE
USING (sender_email = public.get_user_email(auth.uid()))
WITH CHECK (sender_email = public.get_user_email(auth.uid()));