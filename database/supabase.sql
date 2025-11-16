-- Public read access (anyone can view images)
CREATE POLICY "Public Read Access"
ON storage.objects
FOR SELECT
USING ( bucket_id = 'Images' );

-- Service role upload (backend handles authentication via JWT)
CREATE POLICY "Service Upload"
ON storage.objects
FOR INSERT
WITH CHECK ( bucket_id = 'Images' );

-- Service role delete (backend handles authentication via JWT)
CREATE POLICY "Service Delete"
ON storage.objects
FOR DELETE
USING ( bucket_id = 'Images' );