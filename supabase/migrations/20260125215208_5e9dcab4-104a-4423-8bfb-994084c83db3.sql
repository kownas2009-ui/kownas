-- Add file_url column to student_notes
ALTER TABLE public.student_notes 
ADD COLUMN file_url TEXT DEFAULT NULL;

-- Create storage bucket for note attachments
INSERT INTO storage.buckets (id, name, public)
VALUES ('note-attachments', 'note-attachments', true)
ON CONFLICT (id) DO NOTHING;

-- Allow admins to upload files
CREATE POLICY "Admins can upload note attachments"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'note-attachments' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Allow admins to update files
CREATE POLICY "Admins can update note attachments"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'note-attachments' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Allow admins to delete files
CREATE POLICY "Admins can delete note attachments"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'note-attachments' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Allow anyone authenticated to view/download files (students need to download)
CREATE POLICY "Authenticated users can view note attachments"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'note-attachments' 
  AND auth.role() = 'authenticated'
);