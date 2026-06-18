-- Testimonials images table
CREATE TABLE IF NOT EXISTS testimonials_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_testimonials_images_created_at ON testimonials_images(created_at DESC);

ALTER TABLE testimonials_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Testimonials images are publicly readable"
  ON testimonials_images FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert testimonials images"
  ON testimonials_images FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update testimonials images"
  ON testimonials_images FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete testimonials images"
  ON testimonials_images FOR DELETE USING (auth.role() = 'authenticated');

-- Storage bucket for testimonial images
INSERT INTO storage.buckets (id, name, public) VALUES ('testimonials', 'testimonials', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Testimonials storage is publicly accessible"
  ON storage.objects FOR SELECT USING (bucket_id = 'testimonials');

CREATE POLICY "Authenticated users can upload testimonials images"
  ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'testimonials' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update testimonials images"
  ON storage.objects FOR UPDATE USING (bucket_id = 'testimonials' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete testimonials images"
  ON storage.objects FOR DELETE USING (bucket_id = 'testimonials' AND auth.role() = 'authenticated');
