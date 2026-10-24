-- ====================================================================
-- RAKSHITH PORTFOLIO CMS — STORAGE BUCKETS & STORAGE POLICIES
-- Version: 1.0.0 (October 2026)
-- ====================================================================

-- 1. Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('portfolio-public', 'portfolio-public', true, 10485760, ARRAY['application/pdf', 'image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']),
  ('portfolio-private', 'portfolio-private', false, 10485760, ARRAY['application/pdf', 'image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'])
ON CONFLICT (id) DO NOTHING;

-- 2. Storage Policies for portfolio-public (Public Read, Admin Write)
CREATE POLICY "Public Read Access for portfolio-public"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'portfolio-public');

CREATE POLICY "Admin Upload Access for portfolio-public"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'portfolio-public' AND public.is_admin());

CREATE POLICY "Admin Update Access for portfolio-public"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'portfolio-public' AND public.is_admin());

CREATE POLICY "Admin Delete Access for portfolio-public"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'portfolio-public' AND public.is_admin());

-- 3. Storage Policies for portfolio-private (Admin ONLY)
CREATE POLICY "Admin Read Access for portfolio-private"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'portfolio-private' AND public.is_admin());

CREATE POLICY "Admin Upload Access for portfolio-private"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'portfolio-private' AND public.is_admin());

CREATE POLICY "Admin Update Access for portfolio-private"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'portfolio-private' AND public.is_admin());

CREATE POLICY "Admin Delete Access for portfolio-private"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'portfolio-private' AND public.is_admin());
