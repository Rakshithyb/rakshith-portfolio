import React, { useEffect, useState } from 'react';
import { Save, CheckCircle2, Sliders, Globe, Share2 } from 'lucide-react';
import { ContentStore } from '../../lib/contentStore';
import { SiteSettingsData } from '../../types';
import { Button } from '../../components/Button';

export const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    ContentStore.getSiteSettings().then((data) => {
      setSettings(data);
      setLoading(false);
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    try {
      await ContentStore.updateSiteSettings(settings);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      alert(err?.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const updateVisibility = (key: keyof SiteSettingsData['sectionsVisibility'], val: boolean) => {
    if (!settings) return;
    setSettings({
      ...settings,
      sectionsVisibility: {
        ...settings.sectionsVisibility,
        [key]: val,
      },
    });
  };

  if (loading || !settings) {
    return (
      <div className="py-16 text-center text-xs font-mono text-ink-faint">
        Loading site settings...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-divider pb-6">
        <span className="text-[11px] font-mono uppercase tracking-widest text-ink-faint font-semibold">
          Site Configuration
        </span>
        <h1 className="text-2xl font-serif font-bold text-ink">
          Global Settings & SEO
        </h1>
        <p className="text-xs text-ink-muted mt-1">
          Edit hero copy, contact endpoints, social handles, section visibility, and search metadata.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>Site settings saved and updated!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8 max-w-3xl">
        {/* Profile & Hero Copy */}
        <section className="space-y-4 border border-divider rounded-lg p-6 bg-white">
          <h2 className="text-sm font-serif font-bold text-ink flex items-center gap-2">
            <span>Owner Identity & Hero Typography</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <label className="block mb-1 font-medium text-ink">Owner Full Name</label>
              <input
                type="text"
                value={settings.ownerName}
                onChange={(e) => setSettings({ ...settings, ownerName: e.target.value })}
                className="w-full px-3 py-2 rounded border border-divider outline-none focus:border-ink"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-ink">Role / Professional Title</label>
              <input
                type="text"
                value={settings.roleTitle}
                onChange={(e) => setSettings({ ...settings, roleTitle: e.target.value })}
                className="w-full px-3 py-2 rounded border border-divider outline-none focus:border-ink"
              />
            </div>
          </div>

          <div className="text-xs font-mono space-y-4">
            <div>
              <label className="block mb-1 font-medium text-ink">Academic Status Badge</label>
              <input
                type="text"
                value={settings.educationHeadline}
                onChange={(e) => setSettings({ ...settings, educationHeadline: e.target.value })}
                className="w-full px-3 py-2 rounded border border-divider outline-none focus:border-ink"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-ink">Hero Main Headline</label>
              <input
                type="text"
                value={settings.headline}
                onChange={(e) => setSettings({ ...settings, headline: e.target.value })}
                className="w-full px-3 py-2 rounded border border-divider outline-none focus:border-ink"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-ink">Hero Subheadline</label>
              <textarea
                rows={2}
                value={settings.subheadline}
                onChange={(e) => setSettings({ ...settings, subheadline: e.target.value })}
                className="w-full px-3 py-2 rounded border border-divider outline-none focus:border-ink"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-ink">Short Bio Summary</label>
              <textarea
                rows={3}
                value={settings.bioSummary}
                onChange={(e) => setSettings({ ...settings, bioSummary: e.target.value })}
                className="w-full px-3 py-2 rounded border border-divider outline-none focus:border-ink"
              />
            </div>
          </div>
        </section>

        {/* Contact Links */}
        <section className="space-y-4 border border-divider rounded-lg p-6 bg-white">
          <h2 className="text-sm font-serif font-bold text-ink">
            Direct Contact Links (PRD: Email, LinkedIn, GitHub only)
          </h2>

          <div className="space-y-3 text-xs font-mono">
            <div>
              <label className="block mb-1 font-medium text-ink">Email Address</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full px-3 py-2 rounded border border-divider outline-none focus:border-ink"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-ink">Phone Number</label>
              <input
                type="text"
                value={settings.phone || ''}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                placeholder="+91 81232 70425"
                className="w-full px-3 py-2 rounded border border-divider outline-none focus:border-ink"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-ink">Location / City</label>
              <input
                type="text"
                value={settings.location || ''}
                onChange={(e) => setSettings({ ...settings, location: e.target.value })}
                placeholder="Tiptur, Karnataka, India"
                className="w-full px-3 py-2 rounded border border-divider outline-none focus:border-ink"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-ink">LinkedIn Profile URL</label>
              <input
                type="url"
                value={settings.linkedinUrl}
                onChange={(e) => setSettings({ ...settings, linkedinUrl: e.target.value })}
                className="w-full px-3 py-2 rounded border border-divider outline-none focus:border-ink"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-ink">GitHub Profile URL</label>
              <input
                type="url"
                value={settings.githubUrl}
                onChange={(e) => setSettings({ ...settings, githubUrl: e.target.value })}
                className="w-full px-3 py-2 rounded border border-divider outline-none focus:border-ink"
              />
            </div>
          </div>
        </section>

        {/* Section Visibility Controls */}
        <section className="space-y-4 border border-divider rounded-lg p-6 bg-white">
          <h2 className="text-sm font-serif font-bold text-ink">
            Public Section Visibility
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            {Object.entries(settings.sectionsVisibility).map(([key, val]) => (
              <label
                key={key}
                className="flex items-center gap-2 p-2.5 rounded border border-divider cursor-pointer hover:bg-canvas-subtle"
              >
                <input
                  type="checkbox"
                  checked={val}
                  onChange={(e) => updateVisibility(key as any, e.target.checked)}
                  className="rounded"
                />
                <span className="capitalize">{key}</span>
              </label>
            ))}
          </div>
        </section>

        {/* SEO Meta */}
        <section className="space-y-4 border border-divider rounded-lg p-6 bg-white">
          <h2 className="text-sm font-serif font-bold text-ink">
            Search Engine Optimization (SEO)
          </h2>

          <div className="space-y-3 text-xs font-mono">
            <div>
              <label className="block mb-1 font-medium text-ink">Meta Title</label>
              <input
                type="text"
                value={settings.seoTitle}
                onChange={(e) => setSettings({ ...settings, seoTitle: e.target.value })}
                className="w-full px-3 py-2 rounded border border-divider outline-none focus:border-ink"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-ink">Meta Description</label>
              <textarea
                rows={2}
                value={settings.seoDescription}
                onChange={(e) => setSettings({ ...settings, seoDescription: e.target.value })}
                className="w-full px-3 py-2 rounded border border-divider outline-none focus:border-ink"
              />
            </div>
          </div>
        </section>

        <Button type="submit" isLoading={saving} className="font-mono text-xs">
          <Save className="w-3.5 h-3.5" />
          <span>Save Site Settings</span>
        </Button>
      </form>
    </div>
  );
};
