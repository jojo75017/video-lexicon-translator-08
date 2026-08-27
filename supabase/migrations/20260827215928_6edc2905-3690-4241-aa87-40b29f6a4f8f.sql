CREATE POLICY "contentstudio owner read" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'contentstudio'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "contentstudio owner write" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'contentstudio'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "contentstudio owner update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'contentstudio'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "contentstudio owner delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'contentstudio'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

GRANT SELECT, INSERT, UPDATE, DELETE ON storage.objects TO authenticated;
GRANT ALL ON storage.objects TO service_role;