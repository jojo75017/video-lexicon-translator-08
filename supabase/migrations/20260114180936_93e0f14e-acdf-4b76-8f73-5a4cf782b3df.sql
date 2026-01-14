-- Enable realtime for subscribers table for instant payment notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.subscribers;