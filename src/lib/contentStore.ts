import {
  ContentType,
  ContentDraft,
  PublishedContent,
  SiteSettingsData,
  MediaAsset,
  AnalyticsSummary,
  PageView,
} from '../types';
import { supabase, isSupabaseConfigured } from './supabase';
import {
  initialSiteSettings,
  initialProjects,
  initialSkills,
  initialCertificates,
  initialExperience,
  initialEducation,
  initialAchievements,
  initialBlogPosts,
  initialResume,
} from './initialSeed';

// Local Storage Keys for Mock/Local Storage Mode
const STORAGE_KEYS = {
  DRAFTS: 'rp_cms_drafts',
  PUBLISHED: 'rp_cms_published',
  SETTINGS: 'rp_cms_settings',
  MEDIA: 'rp_cms_media',
  ANALYTICS: 'rp_cms_analytics',
  AUTH: 'rp_cms_auth_simulated',
};

const SEED_VERSION_KEY = 'rp_cms_seed_version';
const CURRENT_SEED_VERSION = '2026_10_24_resume_v4';

// Initialize Local Seed Data if not present or outdated
function initializeLocalStore() {
  if (typeof window === 'undefined') return;

  const storedVersion = localStorage.getItem(SEED_VERSION_KEY);
  if (storedVersion !== CURRENT_SEED_VERSION) {
    // Purge outdated local storage to ensure strictly verified resume data is loaded
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.DRAFTS);
    localStorage.removeItem(STORAGE_KEYS.PUBLISHED);
    localStorage.removeItem(STORAGE_KEYS.MEDIA);
    localStorage.setItem(SEED_VERSION_KEY, CURRENT_SEED_VERSION);
  }

  if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(initialSiteSettings));
  }

  if (!localStorage.getItem(STORAGE_KEYS.DRAFTS)) {
    const allDrafts: ContentDraft<any>[] = [
      ...initialProjects.map((p) => p.draft),
      ...initialSkills.map((s) => s.draft),
      ...initialCertificates.map((c) => c.draft),
      ...initialExperience.map((e) => e.draft),
      ...initialEducation.map((ed) => ed.draft),
      ...initialAchievements.map((a) => a.draft),
      ...initialBlogPosts.map((b) => b.draft),
      {
        id: 'resume-1',
        content_type: 'resume',
        slug: 'resume',
        sort_order: 1,
        version: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        draft_data: initialResume,
      },
    ];
    localStorage.setItem(STORAGE_KEYS.DRAFTS, JSON.stringify(allDrafts));

    // Also populate initial published content so the public site is immediately readable
    const allPublished: PublishedContent<any>[] = allDrafts.map((draft) => ({
      id: `pub-${draft.id}`,
      content_type: draft.content_type,
      slug: draft.slug,
      content_data: draft.draft_data,
      sort_order: draft.sort_order,
      published_at: draft.created_at,
      updated_at: draft.updated_at,
    }));
    localStorage.setItem(STORAGE_KEYS.PUBLISHED, JSON.stringify(allPublished));
  }

  if (!localStorage.getItem(STORAGE_KEYS.MEDIA)) {
    const defaultMedia: MediaAsset[] = [
      {
        id: 'media-1',
        bucket: 'portfolio-public',
        storage_path: 'documents/professional Resume Rakshith YB.pdf',
        file_name: 'professional Resume Rakshith YB.pdf',
        mime_type: 'application/pdf',
        size_bytes: 600855,
        visibility: 'public',
        created_at: new Date().toISOString(),
      },
    ];
    localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(defaultMedia));
  }

  if (!localStorage.getItem(STORAGE_KEYS.ANALYTICS)) {
    const defaultViews: PageView[] = [
      { id: 'pv-1', page_path: '/', referrer_domain: 'direct', created_at: new Date(Date.now() - 86400000 * 3).toISOString() },
      { id: 'pv-2', page_path: '/projects', referrer_domain: 'github.com', created_at: new Date(Date.now() - 86400000 * 2).toISOString() },
      { id: 'pv-3', page_path: '/blog', referrer_domain: 'linkedin.com', created_at: new Date(Date.now() - 86400000 * 1).toISOString() },
      { id: 'pv-4', page_path: '/', referrer_domain: 'direct', created_at: new Date().toISOString() },
    ];
    localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(defaultViews));
  }
}

initializeLocalStore();

export const ContentStore = {
  // ==========================================
  // PUBLIC ACCESS METHODS (Published only)
  // ==========================================

  async getPublishedContent<T = any>(contentType: ContentType): Promise<PublishedContent<T>[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('published_content')
        .select('*')
        .eq('content_type', contentType)
        .order('sort_order', { ascending: true });
      if (error) {
        console.error('Supabase query error:', error);
        return [];
      }
      return (data || []) as PublishedContent<T>[];
    }

    // Local fallback
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PUBLISHED);
      if (!stored) return [];
      const list: PublishedContent<T>[] = JSON.parse(stored);
      return list
        .filter((item) => item.content_type === contentType)
        .sort((a, b) => a.sort_order - b.sort_order);
    } catch {
      return [];
    }
  },

  async getPublishedBySlug<T = any>(contentType: ContentType, slug: string): Promise<PublishedContent<T> | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('published_content')
        .select('*')
        .eq('content_type', contentType)
        .eq('slug', slug)
        .maybeSingle();
      if (error || !data) return null;
      return data as PublishedContent<T>;
    }

    // Local fallback
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PUBLISHED);
      if (!stored) return null;
      const list: PublishedContent<T>[] = JSON.parse(stored);
      return list.find((item) => item.content_type === contentType && item.slug === slug) || null;
    } catch {
      return null;
    }
  },

  async getSiteSettings(): Promise<SiteSettingsData> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('published_content')
        .select('content_data')
        .eq('content_type', 'site_settings')
        .eq('slug', 'global_settings')
        .maybeSingle();
      if (!error && data?.content_data) {
        return data.content_data as SiteSettingsData;
      }
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback to initial
    }
    return initialSiteSettings;
  },

  // ==========================================
  // ADMIN CMS METHODS (Drafts & Operations)
  // ==========================================

  async getDrafts<T = any>(contentType: ContentType): Promise<ContentDraft<T>[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('content_drafts')
        .select('*')
        .eq('content_type', contentType)
        .order('sort_order', { ascending: true });
      if (error) {
        console.error('Supabase getDrafts error:', error);
        return [];
      }
      return (data || []) as ContentDraft<T>[];
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.DRAFTS);
      if (!stored) return [];
      const list: ContentDraft<T>[] = JSON.parse(stored);
      return list
        .filter((item) => item.content_type === contentType)
        .sort((a, b) => a.sort_order - b.sort_order);
    } catch {
      return [];
    }
  },

  async getDraftById<T = any>(id: string): Promise<ContentDraft<T> | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('content_drafts')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (error || !data) return null;
      return data as ContentDraft<T>;
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.DRAFTS);
      if (!stored) return null;
      const list: ContentDraft<T>[] = JSON.parse(stored);
      return list.find((item) => item.id === id) || null;
    } catch {
      return null;
    }
  },

  async saveDraft<T = any>(item: Partial<ContentDraft<T>> & { content_type: ContentType; slug: string; draft_data: T }): Promise<ContentDraft<T>> {
    const now = new Date().toISOString();

    if (isSupabaseConfigured && supabase) {
      if (item.id) {
        // Update existing draft with version bump
        const { data, error } = await supabase
          .from('content_drafts')
          .update({
            slug: item.slug,
            draft_data: item.draft_data,
            sort_order: item.sort_order ?? 0,
            version: (item.version || 1) + 1,
            updated_at: now,
          })
          .eq('id', item.id)
          .select()
          .single();
        if (error) throw error;
        return data as ContentDraft<T>;
      } else {
        // Insert new draft
        const { data, error } = await supabase
          .from('content_drafts')
          .insert({
            content_type: item.content_type,
            slug: item.slug,
            draft_data: item.draft_data,
            sort_order: item.sort_order ?? 99,
            version: 1,
            created_at: now,
            updated_at: now,
          })
          .select()
          .single();
        if (error) throw error;
        return data as ContentDraft<T>;
      }
    }

    // Local storage persistence
    const stored = localStorage.getItem(STORAGE_KEYS.DRAFTS);
    const list: ContentDraft<T>[] = stored ? JSON.parse(stored) : [];

    let target: ContentDraft<T>;
    if (item.id) {
      const idx = list.findIndex((x) => x.id === item.id);
      if (idx !== -1) {
        target = {
          ...list[idx],
          slug: item.slug,
          draft_data: item.draft_data,
          sort_order: item.sort_order ?? list[idx].sort_order,
          version: (list[idx].version || 1) + 1,
          updated_at: now,
        };
        list[idx] = target;
      } else {
        target = {
          id: item.id,
          content_type: item.content_type,
          slug: item.slug,
          draft_data: item.draft_data,
          sort_order: item.sort_order ?? list.length + 1,
          version: 1,
          created_at: now,
          updated_at: now,
        };
        list.push(target);
      }
    } else {
      target = {
        id: `draft-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        content_type: item.content_type,
        slug: item.slug,
        draft_data: item.draft_data,
        sort_order: item.sort_order ?? list.length + 1,
        version: 1,
        created_at: now,
        updated_at: now,
      };
      list.push(target);
    }

    localStorage.setItem(STORAGE_KEYS.DRAFTS, JSON.stringify(list));
    return target;
  },

  async deleteDraft(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('content_drafts').delete().eq('id', id);
      return;
    }

    const stored = localStorage.getItem(STORAGE_KEYS.DRAFTS);
    if (!stored) return;
    const list: ContentDraft<any>[] = JSON.parse(stored);
    const filtered = list.filter((x) => x.id !== id);
    localStorage.setItem(STORAGE_KEYS.DRAFTS, JSON.stringify(filtered));
  },

  async publishDraft(draftId: string): Promise<{ success: boolean; publishedItem: PublishedContent<any> }> {
    const now = new Date().toISOString();

    if (isSupabaseConfigured && supabase) {
      // In Supabase, the publish operation queries the draft and inserts/updates published_content
      const { data: draft, error: draftErr } = await supabase
        .from('content_drafts')
        .select('*')
        .eq('id', draftId)
        .single();
      if (draftErr || !draft) throw new Error('Draft not found for publishing');

      const { data: pubData, error: pubErr } = await supabase
        .from('published_content')
        .upsert(
          {
            content_type: draft.content_type,
            slug: draft.slug,
            content_data: draft.draft_data,
            sort_order: draft.sort_order,
            published_at: now,
            updated_at: now,
          },
          { onConflict: 'content_type,slug' }
        )
        .select()
        .single();

      if (pubErr) throw pubErr;
      return { success: true, publishedItem: pubData as PublishedContent<any> };
    }

    // Local storage publish operation
    const drafts: ContentDraft<any>[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.DRAFTS) || '[]');
    const draft = drafts.find((d) => d.id === draftId);
    if (!draft) throw new Error('Draft not found');

    const published: PublishedContent<any>[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.PUBLISHED) || '[]');
    const existingIndex = published.findIndex((p) => p.content_type === draft.content_type && p.slug === draft.slug);

    const publishedRecord: PublishedContent<any> = {
      id: existingIndex !== -1 ? published[existingIndex].id : `pub-${draft.id}`,
      content_type: draft.content_type,
      slug: draft.slug,
      content_data: draft.draft_data,
      sort_order: draft.sort_order,
      published_at: now,
      updated_at: now,
    };

    if (existingIndex !== -1) {
      published[existingIndex] = publishedRecord;
    } else {
      published.push(publishedRecord);
    }

    localStorage.setItem(STORAGE_KEYS.PUBLISHED, JSON.stringify(published));
    return { success: true, publishedItem: publishedRecord };
  },

  async unpublishContent(contentType: ContentType, slug: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase
        .from('published_content')
        .delete()
        .eq('content_type', contentType)
        .eq('slug', slug);
      return;
    }

    const published: PublishedContent<any>[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.PUBLISHED) || '[]');
    const filtered = published.filter((p) => !(p.content_type === contentType && p.slug === slug));
    localStorage.setItem(STORAGE_KEYS.PUBLISHED, JSON.stringify(filtered));
  },

  async isSlugPublished(contentType: ContentType, slug: string): Promise<boolean> {
    const published = await this.getPublishedBySlug(contentType, slug);
    return Boolean(published);
  },

  async updateSiteSettings(settings: SiteSettingsData): Promise<void> {
    const now = new Date().toISOString();
    if (isSupabaseConfigured && supabase) {
      await supabase.from('site_settings').upsert({
        id: 'global_settings',
        draft_data: settings,
        updated_at: now,
      });
      // also update published record if settings are published
      await supabase.from('published_content').upsert(
        {
          content_type: 'site_settings',
          slug: 'global_settings',
          content_data: settings,
          sort_order: 1,
          published_at: now,
          updated_at: now,
        },
        { onConflict: 'content_type,slug' }
      );
    }
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },

  // ==========================================
  // MEDIA MANAGEMENT
  // ==========================================

  async getMediaAssets(): Promise<MediaAsset[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('media_assets').select('*').order('created_at', { ascending: false });
      if (!error && data) return data as MediaAsset[];
    }

    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.MEDIA) || '[]');
    } catch {
      return [];
    }
  },

  async saveMediaRecord(asset: Omit<MediaAsset, 'id' | 'created_at'>): Promise<MediaAsset> {
    const newAsset: MediaAsset = {
      ...asset,
      id: `media-${Date.now()}`,
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase.from('media_assets').insert(newAsset).select().single();
      if (data) return data as MediaAsset;
    }

    const current = await this.getMediaAssets();
    current.unshift(newAsset);
    localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(current));
    return newAsset;
  },

  async deleteMediaAsset(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('media_assets').delete().eq('id', id);
    }
    const current = await this.getMediaAssets();
    const filtered = current.filter((m) => m.id !== id);
    localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(filtered));
  },

  // ==========================================
  // PRIVACY-FRIENDLY ANALYTICS
  // ==========================================

  async recordPageView(pagePath: string): Promise<void> {
    // Avoid tracking admin or preview routes
    if (pagePath.startsWith('/admin') || pagePath.startsWith('/preview')) {
      return;
    }

    const referrer = document.referrer ? new URL(document.referrer).hostname : 'direct';
    const now = new Date().toISOString();

    if (isSupabaseConfigured && supabase) {
      await supabase.from('page_views').insert({
        page_path: pagePath,
        referrer_domain: referrer,
      });
      return;
    }

    try {
      const current: PageView[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ANALYTICS) || '[]');
      current.push({
        id: `pv-${Date.now()}`,
        page_path: pagePath,
        referrer_domain: referrer,
        created_at: now,
      });
      // Cap at 1000 items in local storage
      if (current.length > 1000) current.shift();
      localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(current));
    } catch {
      // analytics fail silently
    }
  },

  async getAnalyticsSummary(): Promise<AnalyticsSummary> {
    let views: PageView[] = [];

    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase.from('page_views').select('*');
      views = (data || []) as PageView[];
    } else {
      views = JSON.parse(localStorage.getItem(STORAGE_KEYS.ANALYTICS) || '[]');
    }

    const now = Date.now();
    const sevenDaysAgo = now - 7 * 86400000;
    const thirtyDaysAgo = now - 30 * 86400000;

    let viewsLast7Days = 0;
    let viewsLast30Days = 0;
    const pathCounts: Record<string, number> = {};
    const refCounts: Record<string, number> = {};

    for (const v of views) {
      const time = new Date(v.created_at).getTime();
      if (time >= sevenDaysAgo) viewsLast7Days++;
      if (time >= thirtyDaysAgo) viewsLast30Days++;

      pathCounts[v.page_path] = (pathCounts[v.page_path] || 0) + 1;
      const ref = v.referrer_domain || 'direct';
      refCounts[ref] = (refCounts[ref] || 0) + 1;
    }

    const topPages = Object.entries(pathCounts)
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const referrers = Object.entries(refCounts)
      .map(([domain, count]) => ({ domain, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalViews: views.length,
      viewsLast7Days,
      viewsLast30Days,
      topPages,
      referrers,
    };
  },

  // ==========================================
  // EXPORT & BACKUP
  // ==========================================

  async exportAllContent() {
    const drafts = JSON.parse(localStorage.getItem(STORAGE_KEYS.DRAFTS) || '[]');
    const published = JSON.parse(localStorage.getItem(STORAGE_KEYS.PUBLISHED) || '[]');
    const settings = await this.getSiteSettings();
    const media = await this.getMediaAssets();

    return {
      exportTimestamp: new Date().toISOString(),
      siteSettings: settings,
      contentDrafts: drafts,
      publishedContent: published,
      mediaManifest: media,
      metadata: {
        system: 'Rakshith Portfolio CMS',
        version: '1.0.0',
        note: 'This export contains structured JSON records. Media files must be separately backed up from storage buckets.',
      },
    };
  },
};
