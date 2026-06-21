-- ============================================================================
-- Rollback: Revert to public-write RLS policies
-- Date: 2026-06-21
-- Description:
--   Reverses the hardening migration. Restores public write access to all
--   tables and storage buckets. Intended for emergency rollback only.
-- ============================================================================


-- ============================================================================
-- 1. DROP ALL HARDENED POLICIES (FORWARD MIGRATION POLICIES)
-- ============================================================================

-- Table policies
DROP POLICY IF EXISTS "Blogs are publicly readable" ON blogs;
DROP POLICY IF EXISTS "Admin can insert blogs" ON blogs;
DROP POLICY IF EXISTS "Admin can update blogs" ON blogs;
DROP POLICY IF EXISTS "Admin can delete blogs" ON blogs;
DROP POLICY IF EXISTS "Blog categories are publicly readable" ON blog_categories;
DROP POLICY IF EXISTS "Admin can insert blog categories" ON blog_categories;
DROP POLICY IF EXISTS "Admin can update blog categories" ON blog_categories;
DROP POLICY IF EXISTS "Admin can delete blog categories" ON blog_categories;
DROP POLICY IF EXISTS "Blog tags are publicly readable" ON blog_tags;
DROP POLICY IF EXISTS "Admin can insert blog tags" ON blog_tags;
DROP POLICY IF EXISTS "Admin can update blog tags" ON blog_tags;
DROP POLICY IF EXISTS "Admin can delete blog tags" ON blog_tags;
DROP POLICY IF EXISTS "Testimonials images are publicly readable" ON testimonials_images;
DROP POLICY IF EXISTS "Admin can insert testimonials images" ON testimonials_images;
DROP POLICY IF EXISTS "Admin can update testimonials images" ON testimonials_images;
DROP POLICY IF EXISTS "Admin can delete testimonials images" ON testimonials_images;
DROP POLICY IF EXISTS "About section is publicly readable" ON about_section;
DROP POLICY IF EXISTS "Admin can insert about section" ON about_section;
DROP POLICY IF EXISTS "Admin can update about section" ON about_section;
DROP POLICY IF EXISTS "Admin can delete about section" ON about_section;
DROP POLICY IF EXISTS "Published artworks are publicly readable" ON artworks;
DROP POLICY IF EXISTS "Admin can insert artworks" ON artworks;
DROP POLICY IF EXISTS "Admin can update artworks" ON artworks;
DROP POLICY IF EXISTS "Admin can delete artworks" ON artworks;
DROP POLICY IF EXISTS "Categories are publicly readable" ON categories;
DROP POLICY IF EXISTS "Admin can insert categories" ON categories;
DROP POLICY IF EXISTS "Admin can update categories" ON categories;
DROP POLICY IF EXISTS "Admin can delete categories" ON categories;

-- Storage policies (artworks)
DROP POLICY IF EXISTS "Artworks storage is publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Admin can upload artworks" ON storage.objects;
DROP POLICY IF EXISTS "Admin can update artworks" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete artworks" ON storage.objects;

-- Storage policies (blogs-images)
DROP POLICY IF EXISTS "Blogs-images storage is publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Admin can upload blogs-images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can update blogs-images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete blogs-images" ON storage.objects;

-- Storage policies (blog-images)
DROP POLICY IF EXISTS "Blog-images storage is publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Admin can upload blog-images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can update blog-images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete blog-images" ON storage.objects;

-- Storage policies (testimonials)
DROP POLICY IF EXISTS "Testimonials storage is publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Admin can upload testimonials" ON storage.objects;
DROP POLICY IF EXISTS "Admin can update testimonials" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete testimonials" ON storage.objects;

-- Storage policies (about-images)
DROP POLICY IF EXISTS "About-images storage is publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Admin can upload about-images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can update about-images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete about-images" ON storage.objects;


-- ============================================================================
-- 2. RESTORE PUBLIC-READ POLICIES FOR TABLES
-- ============================================================================

-- --- blogs ---
CREATE POLICY "Published blogs are publicly readable"
  ON blogs FOR SELECT
  USING (published = true OR auth.role() = 'authenticated');

CREATE POLICY "Anyone can insert blogs"
  ON blogs FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update blogs"
  ON blogs FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete blogs"
  ON blogs FOR DELETE
  USING (true);

-- --- blog_categories ---
CREATE POLICY "Blog categories are publicly readable"
  ON blog_categories FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert blog categories"
  ON blog_categories FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update blog categories"
  ON blog_categories FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete blog categories"
  ON blog_categories FOR DELETE
  USING (true);

-- --- blog_tags ---
CREATE POLICY "Blog tags are publicly readable"
  ON blog_tags FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert blog tags"
  ON blog_tags FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can delete blog tags"
  ON blog_tags FOR DELETE
  USING (true);

-- --- testimonials_images ---
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

-- --- about_section ---
CREATE POLICY "About section is publicly readable"
  ON about_section FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert about section"
  ON about_section FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update about section"
  ON about_section FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete about section"
  ON about_section FOR DELETE
  USING (true);

-- --- artworks (public read of published only, public write) ---
CREATE POLICY "Published artworks are publicly readable"
  ON artworks FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert artworks"
  ON artworks FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update artworks"
  ON artworks FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete artworks"
  ON artworks FOR DELETE
  USING (true);

-- --- categories (public read, public write) ---
CREATE POLICY "Categories are publicly readable"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert categories"
  ON categories FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update categories"
  ON categories FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete categories"
  ON categories FOR DELETE
  USING (true);


-- ============================================================================
-- 3. RESTORE PUBLIC-WRITE STORAGE POLICIES
-- ============================================================================

-- --- artworks bucket ---
CREATE POLICY "Artworks are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'artworks');

CREATE POLICY "Anyone can upload artworks"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'artworks');

CREATE POLICY "Anyone can update artworks"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'artworks')
  WITH CHECK (bucket_id = 'artworks');

CREATE POLICY "Anyone can delete artworks"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'artworks');

-- --- blogs-images bucket ---
CREATE POLICY "Blogs-images storage is publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'blogs-images');

CREATE POLICY "Anyone can upload blogs-images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'blogs-images');

CREATE POLICY "Anyone can update blogs-images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'blogs-images')
  WITH CHECK (bucket_id = 'blogs-images');

CREATE POLICY "Anyone can delete blogs-images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'blogs-images');

-- --- blog-images bucket ---
CREATE POLICY "Blog images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'blog-images');

CREATE POLICY "Anyone can upload blog images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'blog-images');

CREATE POLICY "Anyone can update blog images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'blog-images')
  WITH CHECK (bucket_id = 'blog-images');

CREATE POLICY "Anyone can delete blog images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'blog-images');

-- --- testimonials bucket ---
CREATE POLICY "Testimonials storage is publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'testimonials');

CREATE POLICY "Anyone can upload testimonials"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'testimonials');

CREATE POLICY "Anyone can update testimonials"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'testimonials')
  WITH CHECK (bucket_id = 'testimonials');

CREATE POLICY "Anyone can delete testimonials"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'testimonials');

-- --- about-images bucket ---
CREATE POLICY "About images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'about-images');

CREATE POLICY "Anyone can upload about images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'about-images');

CREATE POLICY "Anyone can update about images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'about-images')
  WITH CHECK (bucket_id = 'about-images');

CREATE POLICY "Anyone can delete about images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'about-images');


-- ============================================================================
-- 4. DISABLE RLS ON TABLES THAT DID NOT HAVE IT BEFORE
-- ============================================================================
ALTER TABLE artworks  DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
