-- Make testimonial uploads work with the app's current unauthenticated Supabase usage.
-- The admin panel uses the public Supabase client, so policies that require authenticated
-- Supabase Auth sessions will block inserts even though the UI is acting as "admin".

DROP POLICY IF EXISTS "Authenticated users can insert testimonials images" ON testimonials_images;
DROP POLICY IF EXISTS "Authenticated users can update testimonials images" ON testimonials_images;
DROP POLICY IF EXISTS "Authenticated users can delete testimonials images" ON testimonials_images;
DROP POLICY IF EXISTS "Anyone can insert testimonials images" ON testimonials_images;
DROP POLICY IF EXISTS "Anyone can update testimonials images" ON testimonials_images;
DROP POLICY IF EXISTS "Anyone can delete testimonials images" ON testimonials_images;
DROP POLICY IF EXISTS "Testimonials images are publicly readable" ON testimonials_images;

CREATE POLICY "Testimonials images are publicly readable"
  ON testimonials_images FOR SELECT
  USING (true);

CREATE POLICY "Testimonials images can be inserted by the app client"
  ON testimonials_images FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Testimonials images can be updated by the app client"
  ON testimonials_images FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Testimonials images can be deleted by the app client"
  ON testimonials_images FOR DELETE
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can upload testimonials images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update testimonials images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete testimonials images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload testimonials images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update testimonials images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete testimonials images" ON storage.objects;
DROP POLICY IF EXISTS "Testimonials storage is publicly accessible" ON storage.objects;

CREATE POLICY "Testimonials storage is publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'testimonials');

CREATE POLICY "Testimonials storage uploads are allowed"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'testimonials');

CREATE POLICY "Testimonials storage updates are allowed"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'testimonials')
  WITH CHECK (bucket_id = 'testimonials');

CREATE POLICY "Testimonials storage deletes are allowed"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'testimonials');
