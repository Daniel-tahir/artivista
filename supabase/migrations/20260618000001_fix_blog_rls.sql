-- Fix blogs RLS: allow public access for write operations
-- The project uses a custom frontend-only auth system, not Supabase Auth

DROP POLICY IF EXISTS "Authenticated users can insert blogs" ON blogs;
DROP POLICY IF EXISTS "Authenticated users can update blogs" ON blogs;
DROP POLICY IF EXISTS "Authenticated users can delete blogs" ON blogs;

CREATE POLICY "Anyone can insert blogs"
  ON blogs FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update blogs"
  ON blogs FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete blogs"
  ON blogs FOR DELETE
  USING (true);

-- Fix blog_categories RLS
DROP POLICY IF EXISTS "Authenticated users can insert blog categories" ON blog_categories;
DROP POLICY IF EXISTS "Authenticated users can update blog categories" ON blog_categories;
DROP POLICY IF EXISTS "Authenticated users can delete blog categories" ON blog_categories;

CREATE POLICY "Anyone can insert blog categories"
  ON blog_categories FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update blog categories"
  ON blog_categories FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete blog categories"
  ON blog_categories FOR DELETE
  USING (true);

-- Fix blog_tags RLS
DROP POLICY IF EXISTS "Authenticated users can insert blog tags" ON blog_tags;
DROP POLICY IF EXISTS "Authenticated users can delete blog tags" ON blog_tags;

CREATE POLICY "Anyone can insert blog tags"
  ON blog_tags FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can delete blog tags"
  ON blog_tags FOR DELETE
  USING (true);

-- Fix storage bucket RLS for blog-images
DROP POLICY IF EXISTS "Authenticated users can upload blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete blog images" ON storage.objects;

CREATE POLICY "Anyone can upload blog images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'blog-images');

CREATE POLICY "Anyone can update blog images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'blog-images');

CREATE POLICY "Anyone can delete blog images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'blog-images');
