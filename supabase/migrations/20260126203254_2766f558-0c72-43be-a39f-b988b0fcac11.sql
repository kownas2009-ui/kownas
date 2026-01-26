-- Enable realtime for blocked days/time slots
ALTER PUBLICATION supabase_realtime ADD TABLE public.blocked_days;
ALTER PUBLICATION supabase_realtime ADD TABLE public.blocked_time_slots;