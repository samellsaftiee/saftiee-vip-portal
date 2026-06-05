-- Run this in your Supabase SQL editor
-- ============================================================
-- Table: site_content (stores the entire CMS content as JSON)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.site_content (
  key         TEXT PRIMARY KEY,
  content     JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Anyone can read (public VIP page)
CREATE POLICY "public_read" ON public.site_content
  FOR SELECT USING (true);

-- Only service role can write (admin API uses service key)
CREATE POLICY "service_write" ON public.site_content
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================================
-- Storage bucket: vip-assets (for logo uploads)
-- ============================================================

-- Run in Supabase Storage UI or SQL:
INSERT INTO storage.buckets (id, name, public)
VALUES ('vip-assets', 'vip-assets', true)
ON CONFLICT DO NOTHING;

-- Allow public read
CREATE POLICY "public_read_assets" ON storage.objects
  FOR SELECT USING (bucket_id = 'vip-assets');

-- Allow service role write
CREATE POLICY "service_write_assets" ON storage.objects
  FOR INSERT USING (auth.role() = 'service_role');

CREATE POLICY "service_update_assets" ON storage.objects
  FOR UPDATE USING (auth.role() = 'service_role');
