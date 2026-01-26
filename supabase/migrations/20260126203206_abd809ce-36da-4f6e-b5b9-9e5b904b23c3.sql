-- Enable realtime for remaining tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.student_notes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;