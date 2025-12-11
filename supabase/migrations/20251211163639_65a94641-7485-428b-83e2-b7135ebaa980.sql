
-- Create storage bucket for ebook images
INSERT INTO storage.buckets (id, name, public)
VALUES ('ebook-images', 'ebook-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for the bucket
CREATE POLICY "Users can view their own ebook images"
ON storage.objects FOR SELECT
USING (bucket_id = 'ebook-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own ebook images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'ebook-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own ebook images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'ebook-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own ebook images"
ON storage.objects FOR DELETE
USING (bucket_id = 'ebook-images' AND auth.uid()::text = (storage.foldername(name))[1]);
