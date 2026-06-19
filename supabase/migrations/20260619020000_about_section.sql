CREATE TABLE IF NOT EXISTS about_section (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT,
  content TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE about_section ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE about_section ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();

ALTER TABLE about_section ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "About section is publicly readable" ON about_section;
DROP POLICY IF EXISTS "Anyone can insert about section" ON about_section;
DROP POLICY IF EXISTS "Anyone can update about section" ON about_section;
DROP POLICY IF EXISTS "Anyone can delete about section" ON about_section;

DROP POLICY IF EXISTS "About section is publicly readable" ON about_section;
DROP POLICY IF EXISTS "Anyone can insert about section" ON about_section;
DROP POLICY IF EXISTS "Anyone can update about section" ON about_section;
DROP POLICY IF EXISTS "Anyone can delete about section" ON about_section;

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

INSERT INTO storage.buckets (id, name, public) VALUES ('about-images', 'about-images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "About images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload about images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update about images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete about images" ON storage.objects;

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
