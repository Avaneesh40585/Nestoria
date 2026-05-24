-- =============================================================
-- Nestoria — Supabase Storage policies for the "hotel-images" bucket.
-- Run this in the Supabase SQL editor (not in the Render Postgres).
-- The bucket name must match SUPABASE_BUCKET_NAME in backend/.env.
-- =============================================================

CREATE POLICY "public read on hotel-images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'hotel-images');

CREATE POLICY "service-role insert on hotel-images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'hotel-images');

CREATE POLICY "service-role delete on hotel-images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'hotel-images');
