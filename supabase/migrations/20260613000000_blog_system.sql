-- Blog Categories (separate from artwork categories)
CREATE TABLE IF NOT EXISTS blog_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add new columns to blogs table
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES blog_categories(id) ON DELETE SET NULL;
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS og_title TEXT DEFAULT '';
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS og_description TEXT DEFAULT '';
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS og_image TEXT DEFAULT '';
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS focus_keyword TEXT DEFAULT '';
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS canonical_url TEXT DEFAULT '';
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMPTZ;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_blogs_category_id ON blogs(category_id);
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_published ON blogs(published) WHERE published = true;
CREATE INDEX IF NOT EXISTS idx_blogs_published_at ON blogs(published_at DESC) WHERE published = true;
CREATE INDEX IF NOT EXISTS idx_blog_tags_blog_id ON blog_tags(blog_id);
CREATE INDEX IF NOT EXISTS idx_blog_tags_tag ON blog_tags(tag);
CREATE INDEX IF NOT EXISTS idx_blog_categories_slug ON blog_categories(slug);

-- RLS policies
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_tags ENABLE ROW LEVEL SECURITY;

-- Blog categories: allow public read, authenticated full access
CREATE POLICY "Blog categories are publicly readable"
  ON blog_categories FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert blog categories"
  ON blog_categories FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update blog categories"
  ON blog_categories FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete blog categories"
  ON blog_categories FOR DELETE USING (auth.role() = 'authenticated');

-- Blogs: public read for published only, authenticated full access
CREATE POLICY "Published blogs are publicly readable"
  ON blogs FOR SELECT USING (published = true OR auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert blogs"
  ON blogs FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update blogs"
  ON blogs FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete blogs"
  ON blogs FOR DELETE USING (auth.role() = 'authenticated');

-- Blog tags: public read, authenticated full access
CREATE POLICY "Blog tags are publicly readable"
  ON blog_tags FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert blog tags"
  ON blog_tags FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete blog tags"
  ON blog_tags FOR DELETE USING (auth.role() = 'authenticated');

-- Storage bucket for blog images
INSERT INTO storage.buckets (id, name, public) VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Blog images are publicly accessible"
  ON storage.objects FOR SELECT USING (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can upload blog images"
  ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'blog-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update blog images"
  ON storage.objects FOR UPDATE USING (bucket_id = 'blog-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete blog images"
  ON storage.objects FOR DELETE USING (bucket_id = 'blog-images' AND auth.role() = 'authenticated');

-- Default blog categories
INSERT INTO blog_categories (name, slug, description) VALUES
  ('Anime', 'anime', 'Anime character design, art styles, and inspirations'),
  ('Fantasy', 'fantasy', 'Fantasy character concepts and world-building'),
  ('D&D', 'dnd', 'Dungeons & Dragons character design and campaign art'),
  ('VTuber', 'vtuber', 'VTuber model design and virtual avatar art'),
  ('Character Design', 'character-design', 'General character design tips and techniques'),
  ('Tutorials', 'tutorials', 'Step-by-step guides and art tutorials')
ON CONFLICT (slug) DO NOTHING;
