CREATE POLICY "Anyone can upload a testimonial photo"
  ON storage.objects FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'testimonials');

CREATE POLICY "Testimonial photos readable"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'testimonials');
