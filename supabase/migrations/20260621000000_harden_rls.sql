-- ============================================================================
-- Migration: Harden RLS Policies for Supabase Auth
-- Date: 2026-06-21
-- Description:
--   Replaces all public-write RLS policies with auth.uid()-based policies.
--   Only the admin user (auth.uid() = '7d58278c-5431-489d-a864-da60257c6e46') can write.
--   Public retains SELECT where the website depends on it.
--
-- ⚠️  Admin UUID: 7d58278c-5431-489d-a864-da60257c6e46
-- ============================================================================

-- ============================================================================
-- 1. ENABLE RLS ON TABLES THAT LACK IT
-- ============================================================================
ALTER TABLE artworks  ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;


-- ============================================================================
-- 2. DROP ALL EXISTING TABLE POLICIES
-- ============================================================================

-- blogs
DROP POLICY IF EXISTS "Published blogs are publicly readable" ON blogs;
DROP POLICY IF EXISTS "Anyone can insert blogs" ON blogs;
DROP POLICY IF EXISTS "Anyone can update blogs" ON blogs;
DROP POLICY IF EXISTS "Anyone can delete blogs" ON blogs;
DROP POLICY IF EXISTS "Authenticated users can insert blogs" ON blogs;
DROP POLICY IF EXISTS "Authenticated users can update blogs" ON blogs;
DROP POLICY IF EXISTS "Authenticated users can delete blogs" ON blogs;

-- blog_categories
DROP POLICY IF EXISTS "Blog categories are publicly readable" ON blog_categories;
DROP POLICY IF EXISTS "Anyone can insert blog categories" ON blog_categories;
DROP POLICY IF EXISTS "Anyone can update blog categories" ON blog_categories;
DROP POLICY IF EXISTS "Anyone can delete blog categories" ON blog_categories;
DROP POLICY IF EXISTS "Authenticated users can insert blog categories" ON blog_categories;
DROP POLICY IF EXISTS "Authenticated users can update blog categories" ON blog_categories;
DROP POLICY IF EXISTS "Authenticated users can delete blog categories" ON blog_categories;

-- blog_tags
DROP POLICY IF EXISTS "Blog tags are publicly readable" ON blog_tags;
DROP POLICY IF EXISTS "Anyone can insert blog tags" ON blog_tags;
DROP POLICY IF EXISTS "Anyone can delete blog tags" ON blog_tags;
DROP POLICY IF EXISTS "Authenticated users can insert blog tags" ON blog_tags;
DROP POLICY IF EXISTS "Authenticated users can delete blog tags" ON blog_tags;

-- testimonials_images (drop all names that may exist from migration history)
DROP POLICY IF EXISTS "Testimonials images are publicly readable" ON testimonials_images;
DROP POLICY IF EXISTS "Testimonials images can be inserted by the app client" ON testimonials_images;
DROP POLICY IF EXISTS "Testimonials images can be updated by the app client" ON testimonials_images;
DROP POLICY IF EXISTS "Testimonials images can be deleted by the app client" ON testimonials_images;
DROP POLICY IF EXISTS "Anyone can insert testimonials images" ON testimonials_images;
DROP POLICY IF EXISTS "Anyone can update testimonials images" ON testimonials_images;
DROP POLICY IF EXISTS "Anyone can delete testimonials images" ON testimonials_images;
DROP POLICY IF EXISTS "Authenticated users can insert testimonials images" ON testimonials_images;
DROP POLICY IF EXISTS "Authenticated users can update testimonials images" ON testimonials_images;
DROP POLICY IF EXISTS "Authenticated users can delete testimonials images" ON testimonials_images;

-- about_section
DROP POLICY IF EXISTS "About section is publicly readable" ON about_section;
DROP POLICY IF EXISTS "Anyone can insert about section" ON about_section;
DROP POLICY IF EXISTS "Anyone can update about section" ON about_section;
DROP POLICY IF EXISTS "Anyone can delete about section" ON about_section;


-- ============================================================================
-- 3. DROP ALL EXISTING STORAGE POLICIES
-- ============================================================================

-- blog-images bucket (created by original migration)
DROP POLICY IF EXISTS "Blog images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload blog images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update blog images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete blog images" ON storage.objects;

-- testimonials bucket
DROP POLICY IF EXISTS "Testimonials storage is publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Testimonials storage uploads are allowed" ON storage.objects;
DROP POLICY IF EXISTS "Testimonials storage updates are allowed" ON storage.objects;
DROP POLICY IF EXISTS "Testimonials storage deletes are allowed" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload testimonials images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update testimonials images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete testimonials images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload testimonials images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update testimonials images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete testimonials images" ON storage.objects;

-- about-images bucket
DROP POLICY IF EXISTS "About images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload about images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update about images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete about images" ON storage.objects;

-- artworks bucket (in case policies were created manually)
DROP POLICY IF EXISTS "Artworks are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload artworks" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update artworks" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete artworks" ON storage.objects;


-- ============================================================================
-- 4. CREATE HARDENED TABLE POLICIES
-- ============================================================================
-- All write operations require auth.uid() = '7d58278c-5431-489d-a864-da60257c6e46'.
-- Public SELECT is allowed where the website depends on it.

-- --- blogs ---
CREATE POLICY "Blogs are publicly readable"
  ON blogs FOR SELECT
  USING (published = true OR auth.uid() = '7d58278c-5431-489d-a864-da60257c6e46');

CREATE POLICY "Admin can insert blogs"
  ON blogs FOR INSERT
  WITH CHECK (auth.uid() = '7d58278c-5431-489d-a864-da60257c6e46');

CREATE POLICY "Admin can update blogs"
  ON blogs FOR UPDATE
  USING (auth.uid() = '7d58278c-5431-489d-a864-da60257c6e46');

CREATE POLICY "Admin can delete blogs"
  ON blogs FOR DELETE
  USING (auth.uid() = '7d58278c-5431-489d-a864-da60257c6e46');

-- --- blog_categories ---
CREATE POLICY "Blog categories are publicly readable"
  ON blog_categories FOR SELECT
  USING (true);

CREATE POLICY "Admin can insert blog categories"
  ON blog_categories FOR INSERT
  WITH CHECK (auth.uid() = '7d58278c-5431-489d-a864-da60257c6e46');

CREATE POLICY "Admin can update blog categories"
  ON blog_categories FOR UPDATE
  USING (auth.uid() = '7d58278c-5431-489d-a864-da60257c6e46');

CREATE POLICY "Admin can delete blog categories"
  ON blog_categories FOR DELETE
  USING (auth.uid() = '7d58278c-5431-489d-a864-da60257c6e46');

-- --- blog_tags ---
CREATE POLICY "Blog tags are publicly readable"
  ON blog_tags FOR SELECT
  USING (true);

CREATE POLICY "Admin can insert blog tags"
  ON blog_tags FOR INSERT
  WITH CHECK (auth.uid() = '7d58278c-5431-489d-a864-da60257c6e46');

CREATE POLICY "Admin can update blog tags"
  ON blog_tags FOR UPDATE
  USING (auth.uid() = '7d58278c-5431-489d-a864-da60257c6e46');

CREATE POLICY "Admin can delete blog tags"
  ON blog_tags FOR DELETE
  USING (auth.uid() = '7d58278c-5431-489d-a864-da60257c6e46');

-- --- testimonials_images ---
CREATE POLICY "Testimonials images are publicly readable"
  ON testimonials_images FOR SELECT
  USING (true);

CREATE POLICY "Admin can insert testimonials images"
  ON testimonials_images FOR INSERT
  WITH CHECK (auth.uid() = '7d58278c-5431-489d-a864-da60257c6e46');

CREATE POLICY "Admin can update testimonials images"
  ON testimonials_images FOR UPDATE
  USING (auth.uid() = '7d58278c-5431-489d-a864-da60257c6e46');

CREATE POLICY "Admin can delete testimonials images"
  ON testimonials_images FOR DELETE
  USING (auth.uid() = '7d58278c-5431-489d-a864-da60257c6e46');

-- --- about_section ---
CREATE POLICY "About section is publicly readable"
  ON about_section FOR SELECT
  USING (true);

CREATE POLICY "Admin can insert about section"
  ON about_section FOR INSERT
  WITH CHECK (auth.uid() = '7d58278c-5431-489d-a864-da60257c6e46');

CREATE POLICY "Admin can update about section"
  ON about_section FOR UPDATE
  USING (auth.uid() = '7d58278c-5431-489d-a864-da60257c6e46');

CREATE POLICY "Admin can delete about section"
  ON about_section FOR DELETE
  USING (auth.uid() = '7d58278c-5431-489d-a864-da60257c6e46');

-- --- artworks ---
CREATE POLICY "Published artworks are publicly readable"
  ON artworks FOR SELECT
  USING (status = 'published' OR auth.uid() = '7d58278c-5431-489d-a864-da60257c6e46');

CREATE POLICY "Admin can insert artworks"
  ON artworks FOR INSERT
  WITH CHECK (auth.uid() = '7d58278c-5431-489d-a864-da60257c6e46');

CREATE POLICY "Admin can update artworks"
  ON artworks FOR UPDATE
  USING (auth.uid() = '7d58278c-5431-489d-a864-da60257c6e46');

CREATE POLICY "Admin can delete artworks"
  ON artworks FOR DELETE
  USING (auth.uid() = '7d58278c-5431-489d-a864-da60257c6e46');

-- --- categories ---
CREATE POLICY "Categories are publicly readable"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Admin can insert categories"
  ON categories FOR INSERT
  WITH CHECK (auth.uid() = '7d58278c-5431-489d-a864-da60257c6e46');

CREATE POLICY "Admin can update categories"
  ON categories FOR UPDATE
  USING (auth.uid() = '7d58278c-5431-489d-a864-da60257c6e46');

CREATE POLICY "Admin can delete categories"
  ON categories FOR DELETE
  USING (auth.uid() = '7d58278c-5431-489d-a864-da60257c6e46');


-- ============================================================================
-- 5. ENSURE STORAGE BUCKETS EXIST
-- ============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('artworks', 'artworks', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('blogs-images', 'blogs-images', true)
ON CONFLICT (id) DO NOTHING;

-- Note: Original migration created bucket 'blog-images' (singular).
-- The frontend code references 'blogs-images' (plural).
-- We create both if missing, and harden both below.
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;


-- ============================================================================
-- 6. CREATE HARDENED STORAGE POLICIES
-- ============================================================================

-- --- artworks bucket ---
CREATE POLICY "Artworks storage is publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'artworks');

CREATE POLICY "Admin can upload artworks"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'artworks' AND auth.uid() = '7d58278c-5431-489d-a864-da60257c6e46');

CREATE POLICY "Admin can update artworks"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'artworks' AND auth.uid() = '7d58278c-5431-489d-a864-da60257c6e46')
  WITH CHECK (bucket_id = 'artworks' AND auth.uid() = '7d58278c-5431-489d-a864-da60257c6e46');

CREATE POLICY "Admin can delete artworks"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'artworks' AND auth.uid() = '7d58278c-5431-489d-a864-da60257c6e46');

-- --- blogs-images bucket (used by frontend code) ---
CREATE POLICY "Blogs-images storage is publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'blogs-images');

CREATE POLICY "Admin can upload blogs-images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'blogs-images' AND auth.uid() = '7d58278c-5431-489d-a864-da60257c6e46');

CREATE POLICY "Admin can update blogs-images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'blogs-images' AND auth.uid() = '7d58278c-5431-489d-a864-da60257c6e46')
  WITH CHECK (bucket_id = 'blogs-images' AND auth.uid() = '7d58278c-5431-489d-a864-da60257c6e46');

CREATE POLICY "Admin can delete blogs-images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'blogs-images' AND auth.uid() = '7d58278c-5431-489d-a864-da60257c6e46');

-- --- blog-images bucket (created by original migration) ---
CREATE POLICY "Blog-images storage is publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'blog-images');

CREATE POLICY "Admin can upload blog-images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'blog-images' AND auth.uid() = '7d58278c-5431-489d-a864-da60257c6e46');

CREATE POLICY "Admin can update blog-images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'blog-images' AND auth.uid() = '7d58278c-5431-489d-a864-da60257c6e46')
  WITH CHECK (bucket_id = 'blog-images' AND auth.uid() = '7d58278c-5431-489d-a864-da60257c6e46');

CREATE POLICY "Admin can delete blog-images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'blog-images' AND auth.uid() = '7d58278c-5431-489d-a864-da60257c6e46');

-- --- testimonials bucket ---
CREATE POLICY "Testimonials storage is publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'testimonials');

CREATE POLICY "Admin can upload testimonials"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'testimonials' AND auth.uid() = '7d58278c-5431-489d-a864-da60257c6e46');

CREATE POLICY "Admin can update testimonials"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'testimonials' AND auth.uid() = '7d58278c-5431-489d-a864-da60257c6e46')
  WITH CHECK (bucket_id = 'testimonials' AND auth.uid() = '7d58278c-5431-489d-a864-da60257c6e46');

CREATE POLICY "Admin can delete testimonials"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'testimonials' AND auth.uid() = '7d58278c-5431-489d-a864-da60257c6e46');

-- --- about-images bucket ---
CREATE POLICY "About-images storage is publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'about-images');

CREATE POLICY "Admin can upload about-images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'about-images' AND auth.uid() = '7d58278c-5431-489d-a864-da60257c6e46');

CREATE POLICY "Admin can update about-images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'about-images' AND auth.uid() = '7d58278c-5431-489d-a864-da60257c6e46')
  WITH CHECK (bucket_id = 'about-images' AND auth.uid() = '7d58278c-5431-489d-a864-da60257c6e46');

CREATE POLICY "Admin can delete about-images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'about-images' AND auth.uid() = '7d58278c-5431-489d-a864-da60257c6e46');
