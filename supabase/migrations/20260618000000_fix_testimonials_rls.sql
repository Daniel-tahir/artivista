-- Fix testimonials_images RLS: allow public access
-- The project uses a custom frontend-only auth system, not Supabase Auth

DROP POLICY IF EXISTS "Authenticated users can insert testimonials images" ON testimonials_images;
DROP POLICY IF EXISTS "Authenticated users can update testimonials images" ON testimonials_images;
DROP POLICY IF EXISTS "Authenticated users can delete testimonials images" ON testimonials_images;

CREATE POLICY "Anyone can insert testimonials images"
  ON testimonials_images FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update testimonials images"
  ON testimonials_images FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete testimonials images"
  ON testimonials_images FOR DELETE
  USING (true);

-- Fix storage bucket RLS for testimonials bucket

DROP POLICY IF EXISTS "Authenticated users can upload testimonials images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update testimonials images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete testimonials images" ON storage.objects;

CREATE POLICY "Anyone can upload testimonials images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'testimonials');

CREATE POLICY "Anyone can update testimonials images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'testimonials');

CREATE POLICY "Anyone can delete testimonials images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'testimonials');
