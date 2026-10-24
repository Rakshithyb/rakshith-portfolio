-- ====================================================================
-- RAKSHITH PORTFOLIO CMS — DATABASE SCHEMA & RLS POLICIES
-- Version: 1.0.0 (October 2026)
-- Conforms strictly to PRD Security and Publishing Model Specifications
-- ====================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ADMIN USERS ALLOWLIST
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. SAFE IS_ADMIN HELPER FUNCTION
-- Uses a strict search_path and SECURITY DEFINER to prevent recursion or search_path poisoning
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.admin_users
        WHERE user_id = auth.uid()
    );
$$;

-- 3. EDITABLE CONTENT DRAFTS (ISOLATED FROM PUBLIC ACCESS)
CREATE TABLE IF NOT EXISTS public.content_drafts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_type TEXT NOT NULL,
    slug TEXT NOT NULL,
    draft_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    sort_order INTEGER NOT NULL DEFAULT 0,
    version INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_content_drafts_type_slug ON public.content_drafts(content_type, slug);
CREATE INDEX IF NOT EXISTS idx_content_drafts_sort ON public.content_drafts(sort_order);

-- 4. PUBLISHED CONTENT (ACCESSIBLE TO PUBLIC/ANON CLIENTS)
CREATE TABLE IF NOT EXISTS public.published_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_type TEXT NOT NULL,
    slug TEXT NOT NULL,
    content_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    sort_order INTEGER NOT NULL DEFAULT 0,
    published_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_published_type_slug UNIQUE(content_type, slug)
);

CREATE INDEX IF NOT EXISTS idx_published_content_type_slug ON public.published_content(content_type, slug);
CREATE INDEX IF NOT EXISTS idx_published_content_sort ON public.published_content(sort_order);
CREATE INDEX IF NOT EXISTS idx_published_at ON public.published_content(published_at);

-- 5. MEDIA ASSETS METADATA
CREATE TABLE IF NOT EXISTS public.media_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bucket TEXT NOT NULL CHECK (bucket IN ('portfolio-private', 'portfolio-public')),
    storage_path TEXT NOT NULL,
    file_name TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    size_bytes BIGINT NOT NULL,
    visibility TEXT NOT NULL CHECK (visibility IN ('private', 'public')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_media_visibility ON public.media_assets(visibility);

-- 6. SITE SETTINGS
CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY DEFAULT 'global_settings',
    draft_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    version INTEGER NOT NULL DEFAULT 1,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. PRIVACY-CONSCIOUS PAGE VIEWS (NO RAW IP ADDRESSES)
CREATE TABLE IF NOT EXISTS public.page_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_path TEXT NOT NULL,
    referrer_domain TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON public.page_views(created_at);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

-- Enable RLS on ALL tables
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.published_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- 1. admin_users policies
CREATE POLICY "Admins can view admin_users"
    ON public.admin_users FOR SELECT
    TO authenticated
    USING (public.is_admin());

-- 2. content_drafts policies: STRICTLY ADMIN ONLY (Draft isolation)
CREATE POLICY "Admins can select content_drafts"
    ON public.content_drafts FOR SELECT
    TO authenticated
    USING (public.is_admin());

CREATE POLICY "Admins can insert content_drafts"
    ON public.content_drafts FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update content_drafts"
    ON public.content_drafts FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete content_drafts"
    ON public.content_drafts FOR DELETE
    TO authenticated
    USING (public.is_admin());

-- 3. published_content policies: PUBLIC READ ONLY; ADMIN MUTATIONS
CREATE POLICY "Anyone can read published_content"
    ON public.published_content FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Admins can insert published_content"
    ON public.published_content FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update published_content"
    ON public.published_content FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete published_content"
    ON public.published_content FOR DELETE
    TO authenticated
    USING (public.is_admin());

-- 4. media_assets policies: ADMIN ONLY
CREATE POLICY "Admins can manage media_assets"
    ON public.media_assets FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 5. site_settings policies: ADMIN ONLY
CREATE POLICY "Admins can manage site_settings"
    ON public.site_settings FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 6. page_views policies: PUBLIC INSERT ONLY, ADMIN SELECT
CREATE POLICY "Anyone can record page views"
    ON public.page_views FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Admins can view page view metrics"
    ON public.page_views FOR SELECT
    TO authenticated
    USING (public.is_admin());

-- ====================================================================
-- ATOMIC PUBLISHING FUNCTION (TRUSTED SERVER-SIDE BOUNDARY)
-- ====================================================================

CREATE OR REPLACE FUNCTION public.publish_draft_atomic(target_draft_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
DECLARE
    v_draft RECORD;
    v_pub RECORD;
BEGIN
    -- Verify authorization
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Access Denied: Only authorized administrators may publish content.';
    END IF;

    -- Fetch draft
    SELECT * INTO v_draft
    FROM public.content_drafts
    WHERE id = target_draft_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Draft record with ID % not found.', target_draft_id;
    END IF;

    -- Validate required fields
    IF v_draft.slug IS NULL OR length(trim(v_draft.slug)) = 0 THEN
        RAISE EXCEPTION 'Validation failure: Draft slug is required for publishing.';
    END IF;

    -- Atomically Upsert into published_content
    INSERT INTO public.published_content (
        content_type,
        slug,
        content_data,
        sort_order,
        published_at,
        updated_at
    )
    VALUES (
        v_draft.content_type,
        v_draft.slug,
        v_draft.draft_data,
        v_draft.sort_order,
        timezone('utc'::text, now()),
        timezone('utc'::text, now())
    )
    ON CONFLICT (content_type, slug)
    DO UPDATE SET
        content_data = EXCLUDED.content_data,
        sort_order = EXCLUDED.sort_order,
        updated_at = timezone('utc'::text, now())
    RETURNING * INTO v_pub;

    RETURN to_jsonb(v_pub);
END;
$$;
